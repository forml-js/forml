import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Input from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import React, { useMemo, useRef } from 'react';

/**
 * @component
 */
const HiddenFileInput = styled('input')({ display: 'none' });

export default function Form(props) {
    const { form, value } = props;
    const ref = useRef();

    const accept = useMemo(
        () => ('accept' in form ? form.accept : undefined),
        [form]
    );

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
            <HiddenFileInput
                type="file"
                key="hidden"
                name={form.key}
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
