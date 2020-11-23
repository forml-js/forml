import t from 'prop-types';
import React, { useMemo } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';
import { SchemaField } from '../schema-field';

/**
 * @component FieldSet
 */
export default function FieldSet(props) {
    const { form, onChange } = props;
    const localizer = useLocalizer();
    const title = localizer.getLocalizedString(form.title);
    const description = localizer.getLocalizedString(form.description);
    const { readonly: disabled } = form;

    const forms = useMemo(
        () =>
            form.items.map(function (form, index) {
                const { schema } = form;
                const key = index.toString();

                return (
                    <SchemaField
                        form={form}
                        key={key}
                        onChange={onChange}
                        schema={schema}
                    />
                );
            }),
        [form.items]
    );

    const deco = useDecorator();

    return (
        <deco.FieldSet
            form={form}
            title={title}
            description={description}
            disabled={disabled}
        >
            {forms}
        </deco.FieldSet>
    );
}

FieldSet.propTypes = {
    form: FormType,
    onChange: t.func,
};
