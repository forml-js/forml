import t from 'prop-types';
import React, { useCallback } from 'react';
import ObjectPath from 'objectpath';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

/**
 * @component Text
 */
export default function Text(props) {
    const { value, form, error } = props;
    const { otherProps } = props;

    const localizer = useLocalizer();
    const deco = useDecorator();

    const { title, description, placeholder } = form;
    const { readonly: disabled } = form;
    const id = ObjectPath.stringify(form.key);
    const onChange = useCallback(
        function onChange(e) {
            props.onChange(e, e.target.value);
        },
        [props.onChange]
    );

    return (
        <deco.Input.Group form={form}>
            {title && (
                <deco.Label
                    key="label"
                    htmlFor={id}
                    form={form}
                    value={value}
                    error={error}
                >
                    {localizer.getLocalizedString(title)}
                </deco.Label>
            )}
            <deco.Input.Form
                key="form"
                form={form}
                onChange={onChange}
                value={value}
                error={error}
                disabled={disabled}
                id={id}
                placeholder={localizer.getLocalizedString(placeholder)}
                {...otherProps}
            />
            {(error || description) && (
                <deco.Input.Description
                    key="description"
                    form={form}
                    value={value}
                    error={!!error}
                >
                    {localizer.getLocalizedString(description)}
                </deco.Input.Description>
            )}
        </deco.Input.Group>
    );
}

Text.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the text field */
    value: t.string,
};
