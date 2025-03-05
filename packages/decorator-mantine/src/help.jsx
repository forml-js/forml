import React from 'react';
import { Text } from '@mantine/core';

export default function Help(props) {
    const { form } = props;
    const { description } = form;
    return <Text size="sm">{description}</Text>;
}
