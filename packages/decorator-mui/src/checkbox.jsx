import { useError, useDecorator } from '@forml/hooks';
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    Checkbox as MuiCheckbox,
} from '@mui/material';
import React, { useMemo } from 'react';

/**
 * @component
 */
export default function Checkbox({ form, value, onChange }) {
    const options = useDecorator('options');
    const variant = 'variant' in options ? options.variant : 'standard';
    const disabled = 'readonly' in form ? form.readonly : false;

    const title = useMemo(
        () => ('titleFun' in form ? form.titleFun(value) : form.title || ''),
        [form.title, form.titleFun, value]
    );
    const error = useError(form.key);
    const description = 'description' in form ? form.description : null;
    const helperText = error ? error : description;

    return (
        <FormControl variant={variant} error={!!error}>
            <FormControlLabel
                checked={value}
                label={title}
                labelPlacement="end"
                control={
                    <MuiCheckbox
                        checked={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                }
            />
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    );
}
