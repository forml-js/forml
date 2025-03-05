import { DateTimePicker } from '@mantine/dates';
import React, { useCallback, useMemo } from 'react';
import { useError } from '@forml/hooks';

export default function DateTime(props) {
    const { form } = props;
    const value = useMemo(() => new Date(props.value), [props.value]);
    const error = useError(form.key);
    const title = form.title;
    const description = error ? error : form.description;
    const onChange = useCallback(
        (date) => {
            console.log('DateTime.onChange(date: %o)', date);
            const value = date.toLocaleString();
            props.onChange({ target: { value } }, value);
        },
        [props.onChange]
    );

    return (
        <DateTimePicker
            label={title}
            error={!!error}
            description={description}
            value={value}
            onChange={onChange}
        />
    );
}
