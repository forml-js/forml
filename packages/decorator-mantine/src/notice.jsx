import { using } from '@forml/hooks';
import { Alert, Text } from '@mantine/core';
import { useMemo } from 'react';
import Icon from './icon.jsx';

export default function Notice(props) {
    const { form } = props;
    const { description } = form;
    const attributes = useMemo(() => {
        const props = using(form);
        props.add('variant').from('variant', 'filled');
        props.add('title').from('title');
        props.add('icon').with((form) => {
            if ('icon' in form) {
                return <Icon icon={form.icon} />;
            } else {
                return undefined;
            }
        });
        props.add('radius').from('radius');
        props.add('color').from('color');
        return props.value;
    }, [form]);
    return (
        <Alert autoContrast {...attributes}>
            <Text size="sm">{description}</Text>
        </Alert>
    );
}
