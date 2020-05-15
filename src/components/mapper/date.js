import t from 'prop-types';
import { createElement as h } from 'react';

import { useDecorator, useLocalizer } from '../../context';
import { FormType } from '../../types';

/**
 * @component Date
 */
export default function Date(props) {
    const localizer = useLocalizer();
    const deco = useDecorator();

    let { value, form, error } = props;
    let { title, description, placeholder } = form;
    let { readonly: disabled } = form;

    /**
     * Apply localizations
     */
    error = localizer.getLocalizedString(error);
    title = localizer.getLocalizedString(title);
    description = localizer.getLocalizedString(description);
    placeholder = localizer.getLocalizedString(placeholder);

    /**
     * Render
     */
    return h(deco.Input.Group, { form, value, error }, [
        title && h(deco.Label, { key: 'label', form, value, error }, title),
        h(deco.Input.Form, {
            key: 'form',
            type: 'date',
            onChange,
            form,
            value,
            error,
            placeholder,
            disabled,
        }),
        (error || description) &&
            h(
                deco.Input.Description,
                { key: 'description', form, value, error: !!error },
                error || description
            ),
    ]);

    function onChange(e) {
        props.onChange(e, e.target.value);
    }
}

Date.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.string,
};
