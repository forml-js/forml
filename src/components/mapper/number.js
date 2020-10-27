import ObjectPath from 'objectpath';
import t from 'prop-types';
import { createElement as h, useState } from 'react';

import { useDecorator, useLocalizer } from '../../context';
import { FormType } from '../../types';

const valueExceptions = ['', '-'];

/**
 * @component Number
 */
export default function Number(props) {
    const { form, value, error } = props;
    const { readonly: disabled } = form;

    const deco = useDecorator();
    const localizer = useLocalizer();

    const placeholder = localizer.getLocalizedString(form.placeholder);
    const label = localizer.getLocalizedString(
        form.title || form.key[form.key.length - 1]
    );
    const description = localizer.getLocalizedString(form.description);

    const id = ObjectPath.stringify(form.key);
    const [focused, setFocused] = useState(false);

    return h(deco.Input.Group, { form }, [
        h(deco.Label, { key: 'label', form, value, error, htmlFor: id, focused }, label),
        h(deco.Input.Form, {
            key: 'input',
            value,
            error,
            onChange,
            placeholder,
            form,
            id,
            onFocus,
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
        let value = e.target.value;

        if (valueExceptions.includes(value)) {
            props.onChange(e, value);
            return;
        }

        value = parseFloat(value);

        if (isNaN(value)) {
            e.preventDefault();
            return;
        }

        props.onChange(e, value);
    }

    function onFocus() {
        setFocused(true);
    }

    function onBlur() {
        setFocused(false);
    }
}

Number.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the number */
    value: t.number,
};
