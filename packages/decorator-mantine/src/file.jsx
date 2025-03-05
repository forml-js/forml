import React, { useCallback } from 'react';
import { FileInput } from '@mantine/core';
import { useError, useFileField } from '@forml/hooks';

export default function File(props) {
    const { form } = props;
    const error = useError(form.key);
    const description = error ? error : form.description;
    const onChange = useCallback(
        (event) => props.onChange(event, event.target.value),
        [props.onChange]
    );
    return (
        <FileInput
            label={form.title}
            error={!!error}
            description={description}
            onChange={onChange}
        />
    );
}
