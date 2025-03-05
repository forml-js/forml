import React, { useCallback } from 'react';
import { TextInput } from '@mantine/core';
import { useError } from '@forml/hooks';

export default function Text(props) {
    const { form, value } = props;
    const error = useError(form.key);
    const title = form.title;
    const description = error ? error : form.description;
    const onChange = useCallback(
        (event) => props.onChange(event, event.target.value),
        [props.onChange]
    );

    return (
        <TextInput
            label={title}
            error={!!error}
            description={description}
            value={value}
            onChange={onChange}
        />
    );
}
