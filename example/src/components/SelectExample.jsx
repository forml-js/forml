import React, { useMemo } from 'react';
import { SchemaForm } from '@forml/core';
import { samples } from '../samples.jsx';
import decorators from '../decorators.js';

const blacklist = ['Raw HTML', 'PDF Renderer'];

export default function SelectExample(props) {
    const enm = useMemo(() => Object.keys(samples), [samples]);
    const titles = useMemo(
        () =>
            enm.map((k) => {
                const segments = k.split('/');
                return `${samples[k].schema.title} (${segments[segments.length - 1]})`;
            }),
        [enm]
    );

    const form = useMemo(() => [{ key: [], title: 'Sample', titles }], []);
    const schema = useMemo(() => ({ type: 'string', enum: enm }), [enm]);
    const model = props.selected;
    const decorator = useMemo(
        () =>
            blacklist.includes(props.decorator)
                ? decorators['Material UI (Standard)']
                : decorators[props.decorator],
        [props.decorator]
    );

    return (
        <SchemaForm
            schema={schema}
            form={form}
            model={model}
            onChange={props.onChange}
            decorator={decorator}
        />
    );
}
