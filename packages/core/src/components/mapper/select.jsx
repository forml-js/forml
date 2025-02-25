import t from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '#types';

/**
 * @component Select
 */
export default function Select(props) {
    const { form, value } = props;

    const Select = useDecorator('select');
    const onChange = useCallback(
        function onChange(event, value) {
            console.log(
                'Select.onChangeSet(event: %o, value: %o)',
                event,
                value
            );
            props.onChangeSet(event, value);
        },
        [props.onChange]
    );

    return <Select value={value} onChange={onChange} form={form} />;
}

Select.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the string */
    value: t.string,
};
