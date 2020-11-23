import t from 'prop-types';
import React from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

const valueExceptions = ['', '-'];

/**
 * @component Integer
 */
export default function Integer(props) {
    const { value, form, error } = props;

    const deco = useDecorator();
    const localizer = useLocalizer();

    const placeholder = localizer.getLocalizedString(form.placeholder);
    const label = localizer.getLocalizedString(
        form.title || form.key[form.key.length - 1]
    );
    const description = localizer.getLocalizedString(form.description);

    return (
        <deco.Input.Group form={form}>
            {label && (
                <deco.Label key="label" form={form} value={value} error={error}>
                    {label}
                </deco.Label>
            )}
            <deco.Input.Form
                key="input"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                form={form}
                error={error}
            />
            {(error || description) && (
                <deco.Input.Description
                    key="description"
                    form={form}
                    value={value}
                    error={!!error}
                >
                    {error || description}
                </deco.Input.Description>
            )}
        </deco.Input.Group>
    );

    function onChange(e) {
        let value = e.target.value;

        if (valueExceptions.includes(value)) {
            props.onChange(e, value);
            return;
        }

        value = parseInt(value);

        if (isNaN(value)) {
            e.preventDefault();
            return;
        }

        props.onChange(e, value);
    }
}

Integer.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.number,
};
