import debug from 'debug';
import ObjectPath from 'objectpath';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useActionsFor, useMappedField, useModelFor } from '@forml/hooks';
import { FormType } from '#types';

const log = debug('forml:core:schema-field');

function ValueField(props) {
    const { form, parent, onChange, prefix } = props;

    const key = useMemo(() => {
        if (prefix) {
            let base = prefix;
            if (typeof base === 'string') {
                base = ObjectPath.parse(base);
            }
            if (typeof form.key === 'string') {
                const key = ObjectPath.parse(form.key);
                return [...base, ...key];
            } else {
                return [...base, ...form.key];
            }
        } else {
            return form.key;
        }
    }, [form.key, prefix]);

    const Field = useMappedField(form.type);
    const field = useModelFor(key);
    const actions = useActionsFor(key);

    const onChangeSet = useCallback(
        (event, value) => {
            const nextModel = actions.setValue(value);
            if (onChange) {
                onChange(event, nextModel);
            }
        },
        [actions, onChange]
    );

    if (!Field) {
        log(
            'ValueField.fail(key: %o, form: %o) : !Field : form : %o',
            key,
            form
        );
        return null;
    }

    return (
        <Field
            form={form}
            path={field.path}
            schema={field.schema}
            onChangeSet={onChangeSet}
            parent={parent}
            onChange={onChange}
        />
    );
}

function WrapperField(props) {
    const { form, parent, onChange } = props;
    const Field = useMappedField(form.type);

    if (!Field) {
        log('WrapperField.fail(type: %o, form: %o)', form.type, form);
        return null;
    }

    return <Field form={form} parent={parent} onChange={onChange} />;
}

export function SchemaField(props) {
    const { form } = props;

    const Component = useMemo(
        () => ('key' in form ? ValueField : WrapperField),
        [form]
    );

    return <Component {...props} />;
}

SchemaField.propTypes = {
    schema: PropTypes.object,
    form: FormType,
};
