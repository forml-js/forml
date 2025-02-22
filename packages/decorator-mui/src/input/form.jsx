import { Input as BaseInput, styled } from '@mui/material';
import debug from 'debug';
import React, { useMemo } from 'react';

import Date from './date.jsx';
import DateTime from './datetime.jsx';
import File from './file.jsx';

const log = debug('forml:decorator-mui:input:form');

const Input = styled(BaseInput)(({ theme, fullWidth, ...props }) => ({
    width: fullWidth ? 'fill-available' : 'auto',
}));

function Plain(props) {
    const { form, value, ...forwardProps } = props;
    const fullWidth = useMemo(
        () => ('fullWidth' in form ? form.fullWidth : undefined),
        [form]
    );

    return <Input {...forwardProps} maxRows={props.maxRows ?? props.rowMax} value={value ?? ''} fullWidth={fullWidth} />;
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
