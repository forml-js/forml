import t from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useDecorator, useValue } from '@forml/hooks';
import { FormType } from '#types';

const valueExceptions = ['-'];
const valueReplacements = { '0-': '-', '': 0 };

/**
 * @component Integer
 */
export default function Integer(props) {
    const { form } = props;
    const Decorator = useDecorator('text');
    const value = useValue(form.key);
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
