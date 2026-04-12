import { useDecorator } from '@forml/hooks';
import { Box, Paper, Tabs, Scroller, Title, Text } from '@mantine/core';
import React from 'react';

function Header(props) {
    const { form } = props;
    if (form.title || form.description) {
        return (
            <Box className="forml-header">
                {form.title && <Title order={6}>{form.title}</Title>}
                {form.description && <Text size="xs">{form.description}</Text>}
            </Box>
        );
    } else {
        return null;
    }
}

export default function Container(props) {
    const { form, value, activateTab } = props;
    const options = useDecorator('options');
    const paperClass = options.filled
        ? 'forml-tabs-root forml-filled'
        : 'forml-tabs-root';
    const orientation =
        'layout' in form
            ? form.layout === 'horizontal'
                ? 'vertical'
                : 'horizontal'
            : 'horizontal';
    return (
        <Paper className={paperClass}>
            <Header form={form} />
            <Tabs
                className="forml-tabs"
                value={String(value)}
                orientation={orientation}
                onChange={activateTab}
            >
                <Tabs.List form={form} className="forml-tabs-list">
                    {orientation === 'vertical' ? (
                        props.tabs
                    ) : (
                        <Scroller>{props.tabs}</Scroller>
                    )}
                </Tabs.List>
                {props.panels}
            </Tabs>
        </Paper>
    );
}
