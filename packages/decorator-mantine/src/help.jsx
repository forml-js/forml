import React, { useMemo } from 'react';
import { Text, Title } from '@mantine/core';
import { using } from '@forml/hooks';

export default function Help(props) {
    const { form } = props;
    const { description } = form;

    const [Component, attributes] = useMemo(() => {
        const props = using(form);
        props.add('size').from('size', 'sm');
        props.add('fw').from('weight');
        props.add('fs').from('style');
        props.add('td').from('decoration');
        props.add('c').from('color');
        props.add('tt').from('transform');
        props.add('ta').from('align');

        const variant = 'variant' in form ? form.variant : 'body';
        let Component = Text;
        if (variant.startsWith('h')) {
            Component = Title;
            props.add('size', form.variant);
        } else if (variant === 'span') {
            props.add('component', 'span');
        }

        return [Component, props.value];
    }, [form]);

    return <Component {...attributes}>{description}</Component>;
}
