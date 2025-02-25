import { Button, Icon, TextField, styled } from '@mui/material';
import { useError, useLocalizer } from '@forml/hooks';
import React, { useCallback, useMemo, useRef, useState } from 'react';

/**
 * @component
 */
const HiddenFileInput = styled('input')({ display: 'none' });

export default function File(props) {
    const { form, value } = props;
    const ref = useRef();
    const localize = useLocalizer();

    const title = 'title' in form ? localize(form.title) : null;
    const description =
        'description' in form ? localize(form.description) : null;
    const error = useError(form.key);
    const helperText = useMemo(
        () => (error ? error : description),
        [error, description]
    );

    const accept = useMemo(
        () => ('accept' in form ? form.accept : undefined),
        [form]
    );

    const [display, setDisplay] = useState(value);
    const onChange = useCallback(
        async function onChange(event) {
            const [file] = event.target.files ?? [];
            let result = '';

            if (file) {
                result = await getFileFormat(form.format, file);
                setDisplay(file.name);
            } else {
                setDisplay('');
            }

            return props.onChange(event, result);
        },
        [form.format, setDisplay, props.onChangeSet]
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
            props.onChange(event);
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
                value={display}
                variant="standard"
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

function readAsDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            resolve(reader.result);
        });
        reader.readAsDataURL(file);
    });
}

function getFileFormat(format, file) {
    switch (format) {
        case 'data_url':
            return readAsDataURL(file);
        case 'name':
        default:
            return file.name;
    }
}
