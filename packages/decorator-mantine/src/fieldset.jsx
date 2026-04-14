import React, { useMemo } from 'react';
import { Box, Paper, Title, Text, Divider } from '@mantine/core';
import { useDecorator } from '@forml/hooks';
import './fieldset.css';

export default function Fieldset(props) {
    const { form, children } = props;
    const layout = 'layout' in form ? form.layout : 'vertical';
    const padding = 'disablePadding' in form ? !form.disablePadding : true;
    const margin = 'disableMargin' in form ? !form.disableMargin : true;
    const options = useDecorator('options');

    return useMemo(() => {
        if (form.description || form.title) {
            const header = (
                <Box className="forml-header" data-filled={options.filled}>
                    {form.title && <Title order={6}>{form.title}</Title>}
                    {form.description && (
                        <Text size="xs">{form.description}</Text>
                    )}
                </Box>
            );
            return (
                <Paper
                    className="forml-fieldset"
                    shadow="xs"
                    data-padding={padding}
                    data-margin={margin}
                >
                    {header}
                    <Divider />
                    <Box
                        className="forml-fieldset-content"
                        data-orientation={layout}
                    >
                        {children}
                    </Box>
                </Paper>
            );
        } else {
            return (
                <Box
                    className="forml-fieldset-content"
                    data-padding={padding}
                    data-margin={margin}
                    data-orientation={layout}
                >
                    {children}
                </Box>
            );
        }
        return component;
    }, [form.title, form.description, children, options.filled]);
}
