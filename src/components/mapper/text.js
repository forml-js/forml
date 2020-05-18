import t from 'prop-types';
import { createElement as h } from 'react';

import { useDecorator, useLocalizer } from '../../context';
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

    return h(deco.Input.Group, { form }, [
        title &&
            h(
                deco.Label,
                { key: 'label', form, value, error },
                localizer.getLocalizedString(title)
            ),
        h(deco.Input.Form, {
            key: 'form',
            form,
            onChange,
            value,
            error,
            disabled,
            placeholder: localizer.getLocalizedString(placeholder),
            ...otherProps,
        }),
        (error || description) &&
            h(
                deco.Input.Description,
                { key: 'description', form, value, error: !!error },
                localizer.getLocalizedString(error || description)
            ),
    ]);

    function onChange(e) {
        props.onChange(e, e.target.value);
    }
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
