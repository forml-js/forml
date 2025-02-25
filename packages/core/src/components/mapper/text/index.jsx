import React, { useMemo } from 'react';
import * as Format from './format/index.js';

export default function Text(props) {
    const { schema } = props;
    const Component = useMemo(() => {
        if (schema.format in Format) {
            return Format[schema.format];
        } else {
            return Format.Plain;
        }
    }, [schema]);

    console.log('Text(schema: %o, Component: %o)', schema, Component);

    return <Component {...props} />;
}
