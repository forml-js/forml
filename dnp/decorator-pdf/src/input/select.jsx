import { useDecorator } from '@forml/hooks';
import React from 'react';

export default function Select(props) {
    const deco = useDecorator();
    return <deco.Input.Form value={props.value} form={props.form} />;
}
