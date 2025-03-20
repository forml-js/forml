import { Tabs } from '@mantine/core';
import * as Icons from '@tabler/icons-react';
import React, { useMemo } from 'react';

export default function Tab(props) {
    const { form, index } = props;
    const icon = useMemo(() => {
        if (form.icon) {
            let icon = form.icon.replace(/^([a-z])/, (c) => c.toUpperCase());
            icon = icon.replace(/_([a-z])/g, (c) => c[1].toUpperCase());
            icon = `Icon${icon}`;
            return Icons[icon];
        } else {
            return undefined;
        }
    }, [form.icon]);
    return (
        <Tabs.Tab rightSection={icon} value={String(index)}>
            {form.title}
        </Tabs.Tab>
    );
}
