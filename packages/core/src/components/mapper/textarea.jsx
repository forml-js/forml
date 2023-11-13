import t from 'prop-types';
import React, { useMemo } from 'react';

import { FormType } from '../../types';

import Text from './text';

/**
 * @component TextArea
 */
export default function TextArea(props) {
    const { form } = props;
    const otherProps = useMemo(
        () => ({
            multiline: true,
            rows: form.rows,
            rowMax: form.rowMax,
        }),
        [form.rows, form.rowMax]
    );
    return <Text {...props} otherProps={otherProps} />;
}

TextArea.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the string */
    value: t.string,
};
