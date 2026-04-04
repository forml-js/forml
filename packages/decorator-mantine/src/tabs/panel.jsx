import { Tabs } from '@mantine/core';
import React from 'react';

export default function Panel(props) {
    const { index } = props;
    return (
        <Tabs.Panel className="forml-tabs-panel" value={String(index)}>
            {props.children}
        </Tabs.Panel>
    );
}
