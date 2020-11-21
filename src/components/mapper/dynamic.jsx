import React from 'react';

import { useContext } from '../../context';

export default function Dynamic(SchemaForm) {
    return function (props) {
        const { form: parent, value } = props;
        const form = parent.generate;
        const ctx = useContext();
        const { decorator, mapper, localizer } = ctx;

        return (
            <SchemaForm
                {...props}
                decorator={decorator}
                mapper={mapper}
                localizer={localizer}
                form={form}
                model={value}
            />
        );
    };
}
