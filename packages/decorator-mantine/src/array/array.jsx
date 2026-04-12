import React, { Children, useMemo } from 'react';
import { Button, Box, Paper, Divider, Text, Title } from '@mantine/core';
import { useArrayLength, useDecorator } from '@forml/hooks';
import { IconPlus } from '@tabler/icons-react';

import './array.css';

function Empty(props) {
    return (
        <Box p="md" ta="center">
            <Text c="gray.6" fs="italic">
                Empty
            </Text>
        </Box>
    );
}

function Header(props) {
    const { title, description, addText } = props;
    const options = useDecorator('options');
    if (title || description) {
        const rootClass = options.filled
            ? 'forml-header forml-filled'
            : 'forml-header';
        return (
            <>
                <Box className={rootClass}>
                    <Box className="forml-array-header-text">
                        {title && <Title order={6}>{title}</Title>}
                        {description && <Text size="xs">{description}</Text>}
                    </Box>
                    <Button
                        variant="subtle"
                        className="forml-array-header-add-button"
                        color="green.3"
                        onClick={props.onAdd}
                    >
                        <IconPlus />
                        {addText}
                    </Button>
                </Box>
                <Divider />
            </>
        );
    } else {
        return null;
    }
}

function Base(props) {
    const options = useDecorator('options');
    const className = options.filled
        ? 'forml-array forml-filled'
        : 'forml-array';
    return <Paper className={className}>{props.children}</Paper>;
}

export default function ArrayForm(props) {
    const { form, add } = props;
    const itemCount = useArrayLength(form.key);
    const suffix = itemCount === 0 ? <Empty /> : null;
    return (
        <Base>
            <Header
                title={form.title}
                description={form.description}
                addText={form.addText}
                onAdd={add}
            />
            {props.children}
            {suffix}
        </Base>
    );
}
