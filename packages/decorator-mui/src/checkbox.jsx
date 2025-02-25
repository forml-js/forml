import {
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Checkbox as MuiCheckbox,
} from '@mui/material';
import { useLocalizer, useError } from '@forml/hooks';
import React, { useMemo } from 'react';

/**
 * @component
 */
export default function Checkbox({ form, value, onChange }) {
    const localize = useLocalizer();
    const disabled = 'readonly' in form ? form.readonly : false;
    const title = 'title' in form ? localize(form.title) : null;
    const description =
        'description' in form ? localize(form.description) : null;
    const error = useError(form.key);
    const helperText = useMemo(
        () => (error ? error : description),
        [error, description]
    );

    return (
        <FormControl variant="standard" error={!!error} row={false}>
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
