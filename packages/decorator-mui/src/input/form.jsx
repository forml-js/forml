import { styled } from '@mui/material';
import BaseInput from '@mui/material/Input';
import React from 'react';

import Date from './date';
import DateTime from './datetime';
import File from './file';

const Input = styled(BaseInput)(({ theme, fullWidth, ...props }) => ({
    width: fullWidth ? 'fill-available' : 'auto',
}));

/**
 * @component
 */
export default function Form({ error, ...props }) {
    props = { error: !!error, ...props };

    if (props.type === 'file') {
        return <File {...props} />;
    }

    if (props.type === 'date') {
        return <Date {...props} />;
    }

    if (props.type === 'datetime-local') {
        return <DateTime {...props} />;
    }

    const { form } = props;
    const fullWidth = 'fullWidth' in form ? form.fullWidth : undefined;

    return <Input {...props} />;
}
