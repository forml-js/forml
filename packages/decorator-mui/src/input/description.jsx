import FormHelperText from '@material-ui/core/FormHelperText';
import React from 'react';

/**
 * @component
 */
export default function Description(props) {
    return <FormHelperText>{props.children}</FormHelperText>;
}
