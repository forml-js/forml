import React, { useMemo } from 'react';
import { useGenerator, useSchemaFor, useMerged } from '@forml/hooks';

import { SchemaField } from './schema-field.jsx';

export function SchemaRender(props) {
    const schema = useSchemaFor(props.prefix);
    const form = useGenerator(props.form);
    const merged = useMerged(schema, form);

    const children = useMemo(
        () =>
            merged.map((form, index) => {
                if (!form) return;
                const { schema } = form;
                return (
                    <SchemaField
                        key={index}
                        prefix={props.prefix}
                        schema={schema}
                        form={form}
                        onChange={props.onChange}
                    />
                );
            }),
        [merged, props.prefix, props.onChange]
    );

    return <>{children}</>;
}
