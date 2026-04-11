import React, { useMemo } from 'react';
import { SchemaForm } from '@forml/core';
import decorators from '../decorators.js';
import { useComponents } from '../hooks/useComponents.jsx';

const blacklist = ['Raw HTML', 'PDF Renderer'];

console.log('Samples: %O', samples);

const options = ['dark', 'light'];

export default function SelectExample(props) {
    const { useMode, useModeSwitcher } = useComponents();
    const mode = useMode();
    const switchMode = useModeSwitcher();
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
