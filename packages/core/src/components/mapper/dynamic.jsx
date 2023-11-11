import React from 'react';

import { useRenderingContext } from '@forml/hooks';

export default function Dynamic(SchemaForm) {
    return function (props) {
        const { form: parent, value } = props;
        const form = parent.generate;
        const ctx = useRenderingContext();
        const { decorator, mapper, localizer } = ctx;

        return (
            <SchemaForm
                {...props}
                decorator={decorator}
                mapper={mapper}
                localizer={localizer}
                form={form}
                model={value}
                parent={parent}
            />
        );
    };
}
