import FormControl from '@mui/material/FormControl';
import React from 'react';

/**
 * @component
 */
export default function Group({ error, ...props }) {
    return (
        <FormControl variant="standard" error={!!error}>
            {props.children}
        </FormControl>
    );
}
