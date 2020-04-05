import debug from 'debug';
import ObjectPath from 'objectpath';
import PropTypes from 'prop-types';
import {createElement as h, useCallback, useMemo} from 'react';

import {useMapper, useModel} from '../context';
import {FormType} from '../types';

const log = debug('rjsf:schema-field');

export function SchemaField(props) {
    const {schema, form} = props;

    const mapper = useMapper();
    const model  = useModel();
    const Field  = mapper[form.type];
    const key    = form.key !== undefined ? ObjectPath.stringify(form.key) : '';

    if (!Field) {
        log('SchemaField(%s) : !Field : form : %o', key, form);
        return null;
    }

    let value = undefined;
    let error = undefined;
    if (form.key) {
        value = model.getValue(form.key);
        error = model.getError(form.key);
    }

    return h(Field, {schema, form, value, onChange, error});

    function onChange(event, value) {
        const newModel = model.setValue(form.key, value);
        model.onChange(event, newModel);
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
