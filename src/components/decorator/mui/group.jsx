import FormGroup from '@material-ui/core/FormGroup';
import React from 'react';

/**
 * @component
 */
export default function Group(props) {
    const { form } = props;

    const fullWidth = 'fullWidth' in form ? form.fullWidth : false;

    return (
        <FormGroup fullWidth={fullWidth} {...form.otherProps}>
            {props.children}
        </FormGroup>
    );
}
