import React, { useMemo, useCallback } from 'react';
import { Select as MantineSelect } from '@mantine/core';
import { useError, useSelect } from '@forml/hooks';

export default function Select(props) {
    const { form } = props;
    const error = useError(form.key);
    const select = useSelect(form);
    const value = useMemo(
        () => String(select.indexOf(props.value)),
        [props.value, select]
    );
    const data = useMemo(() => {
        return form.titleMap.map(({ name, value }) => {
            return {
                value: String(select.indexOf(value)),
                label: name,
            };
        });
    }, [form.titleMap, select]);
    const onChange = useCallback(
        (selectedIndex) => {
            const value = select.valueOf(Number(selectedIndex));
            props.onChange({ target: { value } }, value);
        },
        [props.onChange, select]
    );
    const description = error ? error : form.description;
    return (
        <MantineSelect
            label={form.title}
            description={description}
            data={data}
            value={value}
            onChange={onChange}
            error={!!error}
        />
    );
}
