import { useError, useDecorator } from '@forml/hooks';
import { TextField } from '@mui/material';
import React, { useMemo } from 'react';

/**
 * @component
 */
export default function Text(props) {
    const { form, value, onChange, otherProps } = props;
    const options = useDecorator('options') || {};

    const title = useMemo(
        () => ('titleFun' in form ? form.titleFun(value) : form.title),
        [form.titleFun, form.title, value]
    );
    const variant = 'variant' in options ? options.variant : 'standard';
    const description = 'description' in form ? form.description : null;
    const error = useError(form.key);

    const helperText = error ? error : description;
    const color = error ? 'error' : 'info';

    return (
        <TextField
            variant={variant}
            label={title}
            error={!!error}
            color={color}
            helperText={helperText}
            value={value}
            onChange={onChange}
            {...otherProps}
        />
    );
}
