import {createElement as h} from 'react';

import {useDecorator, useLocalizer} from '../../context';

/**
 * @component File
 */
export default function File(props) {
  const {value, form} = props;
  let {error} = props;

  const localizer = useLocalizer();
  const deco = useDecorator();

  let {title, description, placeholder} = form;
  const {readonly: disabled} = form;

  title = localizer.getLocalizedString(title);
  description = localizer.getLocalizedString(description);
  placeholder = localizer.getLocalizedString(placeholder);
  error = localizer.getLocalizedString(error);

  return h(deco.Input.Group, {form, value, error}, [
    title && h(deco.Label, {key: 'label', form, value, error}, title),
    h(deco.Input.Form, {
      key: 'form',
      type: 'file',
      form,
      onChange,
      value,
      error,
      placeholder,
      disabled,
    }),
    (error || description) &&
            h(
                deco.Input.Description,
                {key: 'description', form, value, error: !!error},
                error || description,
            ),
  ]);

  function onChange(e, value) {
    return props.onChange(e, value || e.target.value);
  }
}
