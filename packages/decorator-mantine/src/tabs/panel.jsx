import { Tabs } from '@mantine/core';
import React from 'react';
import ObjectPath from 'objectpath';

export default function Panel(props) {
    const { index } = props;
    return (
        <Tabs.Panel className="forml-tabs-panel" value={String(index)}>
            {props.children}
        </Tabs.Panel>
    );
}
