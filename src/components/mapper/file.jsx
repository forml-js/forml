import React from 'react';

import { useDecorator, useLocalizer } from '../../context';

/**
 * @component File
 */
export default function File(props) {
    const { value, form } = props;
    let { error } = props;

    const localizer = useLocalizer();
    const deco = useDecorator();

    let { title, description, placeholder } = form;
    const { readonly: disabled } = form;

    title = localizer.getLocalizedString(title);
    description = localizer.getLocalizedString(description);
    placeholder = localizer.getLocalizedString(placeholder);
    error = localizer.getLocalizedString(error);

    return (
        <deco.Input.Group form={form} value={value} error={error}>
            {title && (
                <deco.Label key="label" form={form} value={value} error={error}>
                    {title}
                </deco.Label>
            )}
            <deco.Input.Form
                key="form"
                type="file"
                form={form}
                onChange={onChange}
                value={value}
                error={error}
                placeholder={placeholder}
                disabled={disabled}
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

    function onChange(e, value) {
        return props.onChange(e, value || e.target.value);
    }
}
