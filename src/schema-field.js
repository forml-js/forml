import debug from 'debug';
import {createElement as h, useState} from 'react';

import {useMapper, useModel} from './context';
import {validator} from './util';

const log = debug('rjsf:schema-field');

export function SchemaField(props) {
    const {schema, form}  = props;

    const [errors, setErrors] = useState([]);
    const mapper              = useMapper();
    const model               = useModel();
    const Field               = mapper[form.type];

    if (!Field) {
        log('SchemaField(%o) : !Field : form : %o', form.key, form);
        return null;
    }

    let value = undefined;
    if (form.key) {
        value = model.getValue(form.key);
    }

    log('SchemaField(%o) : value : %o', form.key, value);

    return h(Field, {schema, form, value, onChange, errors});

    function onChange(e, value) {
        log('onChange() : validate : %o', value)

        const validate = validator(schema);
        const {valid, errors} = validate(value);
        log('onChange() : valid : %o', valid);
        log('onChange() : errors : %o', errors);

        if (!valid) {
            log('onChange() : !valid : preventDefault()');
            setErrors(errors);
            return e.preventDefault();
        }

        const newModel = model.setValue(form.key, value);
        if (model.onChange) {
            model.onChange(e, newModel);
        }
    }
}
