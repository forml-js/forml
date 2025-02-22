import { FormControlLabel, FormGroup, FormHelperText, FormLabel, Checkbox as MuiCheckbox } from '@mui/material';
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
