import t from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '#types';

export default function Multiselect(props) {
    const { form, value } = props;

    const Multiselect = useDecorator('multiselect');

    const onChange = useCallback(
        function onChange(event, value) {
            props.onChangeSet(event, value);
        },
        [props.onChange]
    );

    return <Multiselect value={value} onChange={onChange} form={form} />;
}

Multiselect.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the string */
    value: t.arrayOf(t.string),
};
