import React from 'react';
import { SchemaForm } from '@forml/core';
import * as decorator from '@forml/decorator-mui';
import { samples } from '../samples';

export default function SelectExample(props) {
    const enm = Object.keys(samples);
    const titles = enm.map((k) => samples[k].schema.title);

    const form = [{ key: [], title: 'Sample', titles }];
    const schema = { type: 'string', enum: enm };
    const model = props.selected;

    return (
        <SchemaForm
            schema={schema}
            form={form}
            model={model}
            onChange={onChange}
            decorator={decorator}
        />
    );

    function onChange(event, value) {
        props.onChange(event, value);
    }
}
