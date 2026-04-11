import React, { useCallback, useMemo } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { useError } from '@forml/hooks';

export default function DateForm(props) {
    const { form, value: currentValue } = props;
    const value = useMemo(
        () =>
            currentValue
                ? new Date(currentValue).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
        [currentValue]
    );
    const onChange = useCallback(
        (nextDateObject) => {
            const nextDate = nextDateObject;
            props.onChange({ target: { value: nextDate } }, nextDate);
        },
        [props.onChange]
    );
    const title = form.title;
    const error = useError(form.key);
    const description = error ? error : form.description;
    return (
        <DatePickerInput
            label={title}
            description={description}
            error={!!error}
            value={value}
            onChange={onChange}
        />
    );
}
