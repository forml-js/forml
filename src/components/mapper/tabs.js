import {createElement as h, useState} from 'react';

import {useDecorator, useLocalizer} from '../../context';
import {FormType} from '../../types';
import {SchemaField} from '../schema-field';

/**
 * @component Tabs
 */
export default function Tabs(props) {
    const [value, setValue] = useState(0);
    const {form}            = props;
    const deco              = useDecorator();
    const localizer         = useLocalizer();

    const tabs = [];
    const panels = [];
    for (let index = 0; index < form.tabs.length; ++index) {
        const tab      = form.tabs[index];
        const {schema} = tab;
        const active   = value === index;
        const activate = () => setValue(index);
        tabs.push(h(deco.Tabs.Tab, {
            key: `tab-${index}`,
            form: tab,
            label: localizer.getLocalizedString(tab.title) || localizer.getLocalizedNumber(index),
            active,
            activate,
        }));
        panels.push(h(deco.Tabs.Panel,
                      {
                          key: `panel-${index}`,
                          form: tab,
                          active,
                      },
                      h(SchemaField, {form: tab, schema})));
    }

    return h(deco.Tabs.Container, {className: form.htmlClass, form, value, tabs, panels});
}

Tabs.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
}
