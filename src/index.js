import debug from 'debug';
import ObjectPath from 'objectpath';
import {createElement as h, useEffect, useRef, useState} from 'react';

import {ARRAY_PLACEHOLDER} from './constants';
import Context from './context';
import {merge} from './forms';
import {getMapper, test} from './mapper';
import {SchemaField} from './schema-field';
import {findSchema, valueGetter, valueSetter} from './util';

const log = debug('rjsf:index');

export function SchemaForm({model: incomingModel, schema, form, onChange, ...props}) {
    const [model, setModel] = useState(incomingModel);
    const ref               = useRef(model);

    const getValue = valueGetter(model, schema);
    const setValue = valueSetter(model, schema, setModel)
    const merged   = merge(schema, form);

    useEffect(function() {
        setModel(props.model);
    }, [props.model])

    log('SchemaForm() : model : %o', model);
    log('SchemaForm() : merged : %o', merged);
    log('SchemaForm() : schema : %o', schema);

    const mapper = getMapper(props.mapper);
    return h(Context.Provider,
             {value: {model, schema, form: merged, mapper, getValue, setValue}},
             h(SchemaField, {schema, form: merged[0], onChange}));
}
