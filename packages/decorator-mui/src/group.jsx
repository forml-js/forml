import FormGroup from '@mui/material/FormGroup';
import React, { useMemo } from 'react';

/**
 * @component
 */
export default function Group(props) {
    const { form } = props;

    const fullWidth = useMemo(
        () => ('fullWidth' in form ? form.fullWidth : false),
        [form]
    );

    return (
        <FormGroup fullWidth={fullWidth} {...form.otherProps}>
            {props.children}
        </FormGroup>
    );
}
