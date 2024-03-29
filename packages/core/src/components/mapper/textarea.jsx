import t from 'prop-types';
import React from 'react';

import { FormType } from '../../types';

import Text from './text';

/**
 * @component TextArea
 */
export default function TextArea(props) {
    const { form } = props;
    return (
        <Text
            {...props}
            otherProps={{
                multiline: true,
                rows: form.rows,
                rowMax: form.rowMax,
            }}
        />
    );
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
