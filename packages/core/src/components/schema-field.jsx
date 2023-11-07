import debug from 'debug';
import ObjectPath from 'objectpath';
import PropTypes from 'prop-types';
import React, { useMemo, useCallback } from 'react';

import { useMapper, useModel } from '@forml/hooks';
import { FormType } from '../types';

const log = debug('forml:schema-field');

export function SchemaField(props) {
    const { schema, form, parent } = props;

    const mapper = useMapper();
    const model = useModel();
    const Field = useMemo(() => mapper[form.type], [mapper, form]);
    const key = useMemo(
        () => (form.key !== undefined ? ObjectPath.stringify(form.key) : ''),
        [form]
    );

    const onChange = useCallback(
        function onChange(event, value) {
            const newModel = model.setValue(form.key, value);
            model.onChange(event, newModel);
        },
        [model, form]
    );

    const [value, error] = useMemo(() => {
        if (Field && form.key) {
            return [model.getValue(form.key), model.getError(form.key)];
        } else {
            return [undefined, undefined];
        }
    }, [model, form]);

    if (!Field) {
        log('SchemaField(%s) : !Field : form : %o', key, form);
        return null;
    }

    return (
        <Field
            schema={schema}
            form={form}
            value={value}
            onChange={onChange}
            error={error}
            parent={parent}
        />
    );
}

SchemaField.propTypes = {
    schema: PropTypes.object,
    form: FormType,
};
SchemaField.defaultProps = {
    schema: { type: 'null' },
    form: {},
};
