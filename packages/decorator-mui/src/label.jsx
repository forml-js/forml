import InputLabel from '@material-ui/core/InputLabel';
import React from 'react';

/**
 * @component
 */
export default function Label({ error, ...props }) {
    const shrink =
        props.focused || (props.value !== undefined && props.value !== '');
    const inputProps = { shrink, error: !!error };

    return <InputLabel {...inputProps}>{props.children}</InputLabel>;
}
