import t from 'prop-types';
import ObjectPath from 'objectpath';
import React, { useCallback, useMemo } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '#types';

const valueExceptions = ['-'];
const valueReplacements = { '0-': '-', '': 0 };

/**
 * @component Integer
 */
export default function Integer(props) {
    const { value, form } = props;
    const Decorator = useDecorator('text');
    const onChange = useCallback(
        function onChange(e) {
            let value = e.target.value;

            if (value in valueReplacements) {
                props.onChangeSet(e, valueReplacements[value]);
                return;
            } else if (valueExceptions.includes(value)) {
                props.onChangeSet(e, value);
                return;
            }

            value = parseInt(value);

            if (isNaN(value)) {
                e.preventDefault();
                return;
            }

            props.onChangeSet(e, value);
        },
        [props.onChangeSet]
    );

    return <Decorator form={form} value={value} onChange={onChange} />;
}

Integer.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.number,
};
