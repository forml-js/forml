import React, { useMemo } from 'react';
import { SchemaForm } from '@forml/core';
import * as decorator from '@forml/decorator-mui';
import { samples } from '../samples';

export default function SelectExample(props) {
    const enm = useMemo(() => Object.keys(samples), [samples]);
    const titles = useMemo(
        () => enm.map((k) => samples[k].schema.title),
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
