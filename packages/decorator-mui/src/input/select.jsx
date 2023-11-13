import MuiSelect from '@mui/material/Select';
import React, { useMemo } from 'react';

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
    const selectProps = useMemo(
        () => ({
            error: !!error,
            onChange,
            value: value ?? '',
            placeholder,
            disabled,
            multiple,
        }),
        [error, onChange, value, placeholder, disabled, multiple]
    );
    return <MuiSelect {...selectProps}>{children}</MuiSelect>;
}
