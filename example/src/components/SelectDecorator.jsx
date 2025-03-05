import React, { useMemo, useCallback } from 'react';
import { SchemaForm } from '@forml/core';

import decorators from '../decorators';

const blacklist = ['Raw HTML', 'PDF Renderer'];

export default function SelectDecorator(props) {
    const schema = useMemo(
        () => ({
            type: 'string',
            enum: Object.keys(decorators),
            enumNames: Object.keys(decorators),
        }),
        [decorators]
    );
    const form = useMemo(
        () => [
            {
                key: [],
                title: 'Decorator',
                description:
                    'The component collection to use for rendering the example form',
            },
        ],
        []
    );
    const onChange = useCallback(
        function onChange(event, nextModel) {
            props.onChange(nextModel);
        },
        [props.onChange]
    );
    const model = props.decorator;
    const decorator = useMemo(
        () =>
            blacklist.includes(model)
                ? decorators['Material UI (Standard)']
                : decorators[model],
        [model]
    );

    return (
        <SchemaForm
            schema={schema}
            form={form}
            model={model}
            onChange={onChange}
            decorator={decorator}
        />
    );
}
