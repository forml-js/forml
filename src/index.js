import debug from 'debug';
import ObjectPath from 'objectpath';
import {createElement as h, useEffect, useRef, useState} from 'react';

import Context from './context';
import {getMapper, test} from './mapper';
import {SchemaField} from './schema-field';
import {findSchema, valueGetter, valueSetter} from './util';

const log = debug('rjsf:index');
function getDefaults(schema) {
    const form = [];

    form.push(test(null, schema, {path: []}));

    return form;

    // if (getPreferredType(schema.type) === 'object') {
    //     if (schema.properties) {
    //         for (let key in schema.properties) {
    //             const required = schema.required.includes(key);
    //             const def      = defaultFormDefinition(key, schema.properties[key], {required});

    //             if (def)
    //                 form.push(def);
    //         }
    //     }
    // }
}

function merge(schema, form = ['*'], options = {}) {
    const stdForm = getDefaults(schema);

    const idx = form.indexOf('*');
    if (idx !== -1) {
        form = form.slice(0, idx).concat(stdForm).concat(form.slice(idx + 1));
    }

    form.map(obj => {
        if (typeof obj === 'string') {
            obj = {key: obj};
        }

        if (typeof obj.key === 'string') {
            obj.key = ObjectPath.parse(obj.key);
        }

        if (obj.key) {
            obj.schema = findSchema(obj.key, schema);
        }

        if (Array.isArray(obj.items)) {
            obj.items = merge(schema, obj.items);
        }

        if (Array.isArray(obj.tabs)) {
            for (let tab of obj.tabs) {
                tab.items = merge(schema, tab.items);
            }
        }

        return obj;
    });

    return form;
}

export function SchemaForm({model: incomingModel, schema, form, onChange, ...props}) {
    const [model, setModel] = useState(incomingModel);
    const ref               = useRef(model);

    const getValue = valueGetter(model, schema);
    const setValue = valueSetter(model, schema, setModel)
    const merged   = merge(schema, form);

    log('SchemaForm() : model : %o', model);
    log('SchemaForm() : merged : %o', merged);
    log('SchemaForm() : schema : %o', schema);

    const mapper = getMapper(props.mapper);
    return h(Context.Provider,
             {value: {model, schema, form: merged, mapper, getValue, setValue}},
             h(SchemaField, {schema, form: merged[0], onChange}));
}
