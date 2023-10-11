import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Input from '@mui/material/Input';
import makeStyles from '@mui/styles/makeStyles';
import React, { Fragment, useRef } from 'react';

/**
 * @component
 */
const useStyles = makeStyles(function () {
    return { fileInput: { display: 'none' } };
});
export default function Form(props) {
    const { form, value } = props;
    const ref = useRef();
    const classes = useStyles();

    const accept = 'accept' in form ? form.accept : undefined;

    const endAdornment = (
        <>
            <Button onClick={onClick} key="attach">
                <Icon>attach_file</Icon>
            </Button>
            <Button onClick={clear} key="clear">
                <Icon>clear</Icon>
            </Button>
        </>
    );

    return (
        <>
            <Input
                type="text"
                key="visible"
                endAdornment={endAdornment}
                value={value}
                onClick={onClick}
            />
            <input
                type="file"
                key="hidden"
                className={classes.fileInput}
                accept={accept}
                ref={ref}
                onChange={onChange}
            />
        </>
    );

    async function onChange(event) {
        props.onChange(event);
    }

    function onClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if (ref.current) {
            ref.current.click();
        }
    }

    function clear(event) {
        event.preventDefault();
        event.stopPropagation();
        props.onChange(event);
    }
}
