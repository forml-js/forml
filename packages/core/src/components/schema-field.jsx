import debug from 'debug';
import PropTypes from 'prop-types';
import React, { useMemo, useCallback } from 'react';

import { useMappedField, useKey } from '@forml/hooks';
import { FormType } from '../types';

const log = debug('forml:schema-field');

function ValueField(props) {
    const { form, parent } = props;

    const Field = useMappedField(form.type);
    const field = useKey(form.key);
    const onChange = useCallback(
        (event, value) => {
            field.setValue(value);
        },
        [field.setValue]
    );

    if (!Field) {
        log(
            'ValueField.fail(key: %o, form: %o) : !Field : form : %o',
            form.key,
            form
        );
        return null;
    }

    return (
        <Field
            form={form}
            schema={field.schema}
            value={field.model}
            onChange={onChange}
            //error={error}
            parent={parent}
        />
    );
}

function WrapperField(props) {
    const { form, parent } = props;
    const Field = useMappedField(form.type);

    if (!Field) {
        log('SchemaField.fail(key: %o, form: %o)', form.key, form);
        return null;
    }

    return <Field form={form} parent={parent} />;
}

export function SchemaField(props) {
    const { form } = props;

    const Component = useMemo(
        () => ('key' in form ? ValueField : WrapperField),
        [form.key]
    );

    return <Component {...props} />;
}

SchemaField.propTypes = {
    schema: PropTypes.object,
    form: FormType,
};
SchemaField.defaultProps = {
    schema: { type: 'null' },
    form: {},
};
