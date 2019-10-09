import debug from 'debug';
import ObjectPath from 'objectpath';
import {createElement as h, useEffect, useRef, useState} from 'react';

import {ARRAY_PLACEHOLDER} from './constants';
import Context from './context';
import {merge} from './forms';
import {getMapper, test} from './mapper';
import {SchemaField} from './schema-field';
import * as util from './util';

const log = debug('rjsf:index');

export function SchemaForm({model: incomingModel, schema, form, ...props}) {
    const [model, setModel] = useState(incomingModel);
    const ref               = useRef(model);

    const getValue = util.valueGetter(model, schema);
    const setValue = util.valueSetter(model, schema, setModel)
    const merged   = merge(schema, form);

    useEffect(function() {
        log('SchemaForm(%s) : useEffect() -> setModel(%o)', schema.title, props.model);
        setModel(incomingModel);
    }, [incomingModel])

    useEffect(function() {
        props.onChange(null, model);
    }, [model])

    log('SchemaForm(%s) : model : %o', schema.title, model);
    log('SchemaForm(%s) : merged : %o', schema.title, merged);
    log('SchemaForm(%s) : schema : %o', schema.title, schema);

    const mapper = getMapper(props.mapper);
    return h(Context.Provider,
             {value: {model, schema, form: merged, mapper, getValue, setValue}},
             merged.map(form => {
                 const {schema} = form;
                 return h(SchemaField, {schema, form})
             }));
}

export {util};
