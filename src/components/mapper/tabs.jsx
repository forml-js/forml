import {createElement as h, useState} from 'react';

import {useDecorator, useLocalizer} from '../../context';
import {FormType} from '../../types';
import {SchemaField} from '../schema-field';

/**
 * @component Tabs
 */
export default function Tabs(props) {
  const [value, setValue] = useState(0);
  const {form} = props;
  const deco = useDecorator();
  const localizer = useLocalizer();

  const title = localizer.getLocalizedString(form.title);
  const description = localizer.getLocalizedString(form.description);

  const tabs = [];
  const panels = [];
  for (let index = 0; index < form.tabs.length; ++index) {
    const tab = form.tabs[index];
    const active = value === index;
    const activate = () => setValue(index);

    const {schema} = tab;

    const title = localizer.getLocalizedString(tab.title);
    const description = localizer.getLocalizedString(tab.description);

    tabs.push(
        h(deco.Tabs.Tab, {
          key: `tab-${index}`,
          form: tab,
          title,
          description,
          active,
          activate,
          parent: form,
        }),
    );
    panels.push(
        h(
            deco.Tabs.Panel,
            {
              key: `panel-${index}`,
              form: tab,
              parent: form,
              active,
            },
            h(SchemaField, {form: tab, schema}),
        ),
    );
  }

  return h(deco.Tabs.Container, {
    className: form.htmlClass,
    form,
    value,
    tabs,
    panels,
    title,
    description,
  });
}

Tabs.propTypes = {
  /** The configuration object for this section of the form */
  form: FormType,
};
