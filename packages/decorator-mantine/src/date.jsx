import React, { useCallback, useMemo } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { useError, useValue } from '@forml/hooks';

export default function DateForm(props) {
    const { form } = props;
    const currentValue = useValue(form.key);
    const value = useMemo(
        () =>
            currentValue
                ? new Date(currentValue).toISOString().split('T')[0]
                : undefined,
        [currentValue]
    );
    const onChange = useCallback(
        (nextDateObject) => {
            if (nextDateObject instanceof Date) {
                const nextDate = nextDateObject.toLocaleDateString();
                props.onChange({ target: { value: nextDate } }, nextDate);
            } else {
                const nextDate = nextDateObject;
                props.onChange({ target: { value: nextDate } }, nextDate);
            }
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
