import { TextField } from '@mui/material';
import { useLocalizer, useError } from '@forml/hooks';
import React, { useMemo } from 'react';

/**
 * @component
 */
export default function Text(props) {
    const { form, value, onChange, otherProps, ...forwardedProps } = props;

    const title = useMemo(() => {
        if (form.titleFun) {
            return form.titleFun(value);
        } else {
            return form.title;
        }
    }, [form.title, form.titleFun, value]);
    const error = useError(form.key);
    const description = form.description;
    const helperText = error ? error : description;
    const color = error ? 'error' : 'info';

    return (
        <TextField
            variant="standard"
            label={title}
            error={!!error}
            color={color}
            helperText={helperText}
            value={value}
            onChange={onChange}
            {...forwardedProps}
            {...otherProps}
        />
    );
}
