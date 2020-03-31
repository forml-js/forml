import t from 'prop-types';
import {createElement as h, useState} from 'react';

import {useDecorator, useLocalizer} from '../../context';
import {FormType} from '../../types';

export default function Multiselect(props) {
    const {value, schema, error, form} = props;

    const deco      = useDecorator();
    const localizer = useLocalizer();

    const title       = localizer.getLocalizedString(form.title);
    const placeholder = localizer.getLocalizedString(form.placeholder);
    const description = localizer.getLocalizedString(form.description);

    const menuItems = [];
    for (let i = 0; i < form.titleMap.length; i++) {
        const name = localizer.getLocalizedString(getLabel(form.titleMap[i]));
        const {value} = form.titleMap[i];
        menuItems.push(h(deco.Input.Option, {key: name, value}, name));
    }

    return h(deco.Input.Group, {form, error}, [
        h(deco.Label, {key: 'label', required: form.required, form, value, error}, title),
        h(deco.Input.Select,
          {
              key: 'select',
              multiple: true,
              value,
              placeholder,
              disabled: form.readonly,
              onChange,
              form,
              value,
              error
          },
          menuItems),
        (error || description) &&
            h(deco.Input.Description,
              {key: 'help', error: !!error, form, value},
              localizer.getLocalizedString(error || description)),
    ]);

    function getLabel(item) {
        const {displayFn} = schema;

        if (displayFn) {
            return displayFn(item);
        }

        return item.name;
    }

    function onChange(event) {
        props.onChange(event, event.target.value);
    }
}

Multiselect.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the string */
    value: t.string,
};
