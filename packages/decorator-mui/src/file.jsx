import { Button, Icon, TextField, styled } from '@mui/material';
import { useError, useDecorator, useFileField } from '@forml/hooks';
import React, { useCallback, useMemo, useRef, useState } from 'react';

/**
 * @component
 */
const HiddenFileInput = styled('input')({ display: 'none' });

export default function File(props) {
    const { form, value } = props;
    const ref = useRef();
    const options = useDecorator('options');

    const variant = 'variant' in options ? options.variant : 'standard';
    const title = 'titleFun' in form ? form.titleFun(value) : form.title;
    const description = 'description' in form ? form.description : null;
    const error = useError(form.key);
    const helperText = error ? error : description;
    const accept = 'accept' in form ? form.accept : undefined;
    const fileField = useFileField(form);

    const onChange = useCallback(
        async function onChange(event) {
            const value = await fileField.onChange(event);
            return props.onChange(event, value);
        },
        [fileField.onChange, props.onChangeSet]
    );

    const onClick = useCallback(function onClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if (ref.current) {
            ref.current.click();
        }
    }, []);
    const clear = useCallback(
        function clear(event) {
            event.preventDefault();
            event.stopPropagation();
            const result = fileField.onChange({
                ...event,
                target: { ...event.target, files: [] },
            });
            props.onChange(
                { ...event, target: { ...event.target, value: result } },
                result
            );
        },
        [props.onChange]
    );

    const slotProps = useMemo(() => {
        return {
            input: {
                endAdornment: (
                    <>
                        <Button onClick={onClick} key="attach">
                            <Icon>attach_file</Icon>
                        </Button>
                        <Button onClick={clear} key="clear">
                            <Icon>clear</Icon>
                        </Button>
                    </>
                ),
            },
        };
    }, [onClick, clear]);

    return (
        <>
            <TextField
                type="text"
                key="visible"
                label={title}
                error={!!error}
                helperText={helperText}
                slotProps={slotProps}
                value={fileField.display}
                variant={variant}
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
}
