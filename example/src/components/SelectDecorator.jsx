import React from 'react';
import { SchemaForm } from '@forml/core';

import decorators from '../decorators';

export default function SelectDecorator(props) {
    const schema = {
        type: 'string',
        enum: Object.keys(decorators),
        enumNames: Object.keys(decorators),
    };
    const form = ['*'];
    const model = props.decorator;

    return (
        <SchemaForm
            schema={schema}
            form={form}
            model={model}
            onChange={onChange}
            decorator={decorators.mui}
        />
    )

    function onChange(event, nextModel) {
        props.onChange(nextModel);
    }
}
