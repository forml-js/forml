import React, { forwardRef, useCallback, useMemo, useState } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '#types';
import { SchemaField } from '#components/schema-field.jsx';

const Tab = forwardRef(function Tab(props, ref) {
    const { parent, index, activeIndex, activate } = props;
    const Tabs = useDecorator('tabs');
    const form = parent.tabs[index];
    const active = index === activeIndex;
    const raiseTab = useCallback(() => activate(index), [activate, index]);
    return (
        <Tabs.Tab
            key={`tab-${index}`}
            form={form}
            index={index}
            activate={raiseTab}
            parent={parent}
            ref={ref}
        />
    );
});

const Panel = forwardRef(function Panel(props, ref) {
    const { parent, index, activeIndex, onChange } = props;
    const Tabs = useDecorator('tabs');
    const form = parent.tabs[index];
    const activeDelta = index - activeIndex;
    const { schema } = form;
    return (
        <Tabs.Panel
            key={`panel-${index}`}
            form={form}
            parent={parent}
            delta={activeDelta}
            index={index}
            ref={ref}
        >
            <SchemaField form={form} schema={schema} onChange={onChange} />
        </Tabs.Panel>
    );
});

/**
 * @component Tabs
 */
export default function Tabs(props) {
    const { form, onChange } = props;
    const [value, setValue] = useState(0);
    const Tabs = useDecorator('tabs');

    const [tabs, panels] = useMemo(() => {
        const tabs = [];
        const panels = [];
        for (let index = 0; index < form.tabs.length; ++index) {
            tabs.push(
                <Tab
                    key={`tab-${index}`}
                    parent={form}
                    index={index}
                    activeIndex={value}
                    activate={setValue}
                />
            );
            panels.push(
                <Panel
                    key={`panel-${index}`}
                    parent={form}
                    index={index}
                    activeIndex={value}
                    onChange={onChange}
                />
            );
        }
        return [tabs, panels];
    }, [form, value]);

    return (
        <Tabs
            className={form.htmlClass}
            form={form}
            value={value}
            tabs={tabs}
            panels={panels}
            activateTab={setValue}
        />
    );
}

Tabs.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
};
