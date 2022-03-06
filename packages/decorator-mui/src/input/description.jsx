import FormHelperText from '@mui/material/FormHelperText';
import React from 'react';

/**
 * @component
 */
export default function Description(props) {
    return <FormHelperText>{props.children}</FormHelperText>;
}
