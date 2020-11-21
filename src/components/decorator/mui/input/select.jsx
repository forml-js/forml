import MuiSelect from '@material-ui/core/Select';
import React from 'react';

/**
 * @component
 */
export default function Select({
    error,
    onChange,
    value,
    placeholder,
    disabled,
    children,
    multiple,
}) {
    const selectProps = {
        error: !!error,
        onChange,
        value,
        placeholder,
        disabled,
        multiple,
    };
    return <MuiSelect {...selectProps}>{children}</MuiSelect>;
}
