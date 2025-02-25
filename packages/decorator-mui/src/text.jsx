import { TextField } from '@mui/material';
import { useLocalizer, useError } from '@forml/hooks';
import React, { useMemo } from 'react';

/**
 * @component
 */
export default function Text(props) {
    const { form, value, onChange, otherProps, ...forwardedProps } = props;

    console.log('Text(props: %o)', props);

    const localize = useLocalizer();
    const title = useMemo(() => {
        if (form.titleFun) {
            return localize(form.titleFun(value));
        } else {
            return localize(form.title);
        }
    }, [form.title, form.titleFun, localize, value]);
    const error = useError(form.key);
    const description = useMemo(() => {
        if (form.description) {
            return localize(form.description);
        }
    });
    const helperText = useMemo(() => (error ? error : description), [error]);
    const color = useMemo(() => (error ? 'error' : 'info'), [error]);

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
