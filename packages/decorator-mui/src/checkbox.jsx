import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
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
                checked={checked}
                label={(
                    <>
                        <FormLabel>
                            {title}
                        </FormLabel>
                        {(error || description) && (
                            <FormHelperText error={error}>
                                {error || description}
                            </FormHelperText>
                        )}
                    </>
                )}
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
