import debug from 'debug';
import PropTypes from 'prop-types';
import {createElement as h} from 'react';

import {useMapper, useModel} from '../context';
import {FormType} from '../types';

const log = debug('rjsf:schema-field');

export function SchemaField(props) {
    const {schema, form}  = props;

    const mapper              = useMapper();
    const model               = useModel();
    const Field               = mapper[form.type];

    if (!Field) {
        log('SchemaField(%o) : !Field : form : %o', form.key, form);
        return null;
    }

    let value = undefined;
    let error = undefined;
    if (form.key) {
        value = model.getValue(form.key);
        error = model.getError(form.key);
    }

    return h(Field, {schema, form, value, onChange, error});

    function onChange(e, value) {
        if (model.onChange) {
            const newModel = model.setValue(form.key, value);
            log('onChange() : newModel : %O', newModel);
            model.onChange(e, newModel);
        }
    }
}

SchemaField.propTypes = {
    schema: PropTypes.object,
    form: FormType
};
SchemaField.defaultProps = {
    schema: {type: 'null'},
    form: {},
}
