import { styled } from '@mui/material';
import BaseFormControl from '@mui/material/FormControl';
import React from 'react';

const FormControl = styled(BaseFormControl)(
    ({ theme, fullWidth, ...props }) => ({
        width: fullWidth ? 'fill-available' : 'auto',
    })
);

/**
 * @component
 */
export default function Group({ error, ...props }) {
    const { form } = props;
    const fullWidth = 'fullWidth' in form ? form.fullWidth : undefined;
    return (
        <FormControl variant="standard" fullWidth={fullWidth} error={!!error}>
            {props.children}
        </FormControl>
    );
}
