import React, { useCallback } from 'react';
import { FileInput } from '@mantine/core';
import { useError, useFileField } from '@forml/hooks';

export default function File(props) {
    const { form } = props;
    const error = useError(form.key);
    const description = error ? error : form.description;
    const fileField = useFileField(form);
    const onChange = useCallback(
        async (file) => {
            const files = Array.isArray(file) ? file : file ? [file] : [];
            const event = { target: { files } };
            const result = await fileField.onChange(event);
            props.onChange(event, result);
        },
        [fileField.onChange, props.onChange]
    );
    return (
        <FileInput
            label={form.title}
            error={error}
            description={description}
            multiple={form.allowMultiple}
            accept={'accept' in form ? form.accept : undefined}
            onChange={onChange}
        />
    );
}
