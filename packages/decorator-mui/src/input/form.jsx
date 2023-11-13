import { styled } from '@mui/material';
import BaseInput from '@mui/material/Input';
import React, { memo, useMemo } from 'react';

import Date from './date';
import DateTime from './datetime';
import File from './file';

const Input = memo(
    styled(BaseInput)(({ theme, fullWidth, ...props }) => ({
        width: fullWidth ? 'fill-available' : 'auto',
    }))
);

function Plain(props) {
    const { form } = props;
    const fullWidth = useMemo(
        () => ('fullWidth' in form ? form.fullWidth : undefined),
        [form]
    );

    return <Input {...props} fullWidth={fullWidth} />;
}

/**
 * @component
 */
export default function Form({ error, ...props }) {
    const Component = useMemo(() => {
        if (props.type === 'file') {
            return File;
        } else if (props.type === 'date') {
            return Date;
        } else if (props.type === 'datetime-local') {
            return DateTime;
        } else {
            return Plain;
        }
    }, [props.type]);

    props = useMemo(() => ({ error: !!error, ...props }), [props, error]);

    return <Component {...props} />;
}
