import { Tabs } from '@mantine/core';
import Icon from '../icon.jsx';
import React, { useMemo } from 'react';

export default function Tab(props) {
    const { form, index } = props;
    const icon = useMemo(() => {
        if ('icon' in form) {
            return <Icon icon={form.icon} />;
        } else {
            return undefined;
        }
    }, [form.icon]);
    return (
        <Tabs.Tab rightSection={icon} value={String(index)} data-index={index}>
            {form.title}
        </Tabs.Tab>
    );
}
