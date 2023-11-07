import InputLabel from '@mui/material/InputLabel';
import React, { useMemo } from 'react';

/**
 * @component
 */
export default function Label({ error, ...props }) {
    const shrink = useMemo(
        () =>
            props.focused || (props.value !== undefined && props.value !== ''),
        [props.focused, props.value]
    );
    const inputProps = useMemo(
        () => ({ shrink, error: !!error }),
        [shrink, error]
    );

    return <InputLabel {...inputProps}>{props.children}</InputLabel>;
}
