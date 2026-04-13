import React, { useMemo } from 'react';
import { Box, Paper, Title, Text, Divider } from '@mantine/core';
import { useDecorator } from '@forml/hooks';
import './fieldset.css';

export default function Fieldset(props) {
    const { form, children } = props;
    const layout = 'layout' in form ? form.layout : 'vertical';
    const options = useDecorator('options');

    return useMemo(() => {
        let component = (
            <Box className={`forml-fieldset-content-${layout}`}>{children}</Box>
        );
        if (form.description || form.title) {
            const header = (
                <Box className="forml-header" data-filled={options.filled}>
                    {form.title && <Title order={6}>{form.title}</Title>}
                    {form.description && (
                        <Text size="xs">{form.description}</Text>
                    )}
                </Box>
            );
            component = (
                <Paper className="forml-fieldset" shadow="xs" padding="md">
                    {header}
                    <Divider />
                    {component}
                </Paper>
            );
        }
        return component;
    }, [form.title, form.description, children, options.filled]);
}
