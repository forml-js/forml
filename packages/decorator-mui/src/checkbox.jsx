import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import React from 'react';

/**
 * @component
 */
export default function Checkbox({
    title,
    description,
    error,
    checked,
    onChange,
    disabled,
}) {
    return (
        <FormGroup row={false}>
            <FormControlLabel
                checked={checked}
                label={
                    <>
                        <FormLabel>{title}</FormLabel>
                        {(error || description) && (
                            <FormHelperText error={error}>
                                {error || description}
                            </FormHelperText>
                        )}
                    </>
                }
                control={
                    <MuiCheckbox
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                    />
                }
            />
        </FormGroup>
    );
}
