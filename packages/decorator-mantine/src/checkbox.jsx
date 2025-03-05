import React, { useCallback } from 'react';
import { useError } from '@forml/hooks';
import { Checkbox } from '@mantine/core';

export default function CheckboxDecorator(props) {
    const { form, value } = props;
    const error = useError(form.key);
    const description = error ? error : form.description;
    const onChange = useCallback(
        (event) => props.onChange(event, event.target.value),
        [props.onChange]
    );
    return (
        <Checkbox
            checked={value}
            error={!!error}
            description={description}
            onChange={onChange}
            label={form.title}
        />
    );
}
