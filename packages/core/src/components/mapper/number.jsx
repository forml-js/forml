import t from 'prop-types';
import React, { useCallback } from 'react';

import { useDecorator, useValue } from '@forml/hooks';
import { FormType } from '#types';

const valueExceptions = ['', '-'];

/**
 * @component Number
 */
export default function Number(props) {
    const { form } = props;
    const Text = useDecorator('text');
    const value = useValue(form.key);
    const onChange = useCallback(
        function onChange(e) {
            let value = e.target.value;

            if (valueExceptions.includes(value)) {
                props.onChangeSet(e, value);
                return;
            }

            const appendPoint = /^[0-9]+\.+$/.test(value);

            value = parseFloat(value);

            if (isNaN(value)) {
                e.preventDefault();
                return;
            }

            if (appendPoint) value = `${value}.`;

            props.onChangeSet(e, value);
        },
        [props.onChangeSet]
    );

    return <Text form={form} value={value} onChange={onChange} />;
}

Number.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the number */
    value: t.number,
};
