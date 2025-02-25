import t from 'prop-types';
import React, { useCallback } from 'react';

import { FormType } from '#types';
import { useDecorator } from '@forml/hooks';

/**
 * @component Text
 */
export default function BasicText(props) {
    const { value, form, otherProps } = props;

    const Text = useDecorator('text');
    const onChange = useCallback(
        function onChange(e) {
            props.onChangeSet(e, e.target.value);
        },
        [props.onChangeSet]
    );

    return (
        <Text form={form} value={value} onChange={onChange} {...otherProps} />
    );
}

BasicText.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the text field */
    value: t.string,
};
