import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
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
                label={title}
                control={
                    <MuiCheckbox
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                    />
                }
            />
            {(error || description) && (
                <FormHelperText error={error}>
                    {error || description}
                </FormHelperText>
            )}
        </FormGroup>
    );
}
