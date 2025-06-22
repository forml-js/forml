import React, { useCallback, useMemo } from 'react';
import { useSelect, useError } from '@forml/hooks';

export default function Select(props) {
    const { form } = props;
    const select = useSelect(form);
    const value = select.indexOf(props.value);
    const error = useError(form.key);
    const onChange = useCallback(
        (event) => {
            const selectedIndex = event.target.value;
            const value = select.valueOf(selectedIndex);
            props.onChange(
                { ...event, target: { ...event.target, value } },
                value
            );
        },
        [props.onChange, select]
    );
    const options = useMemo(
        () =>
            form.titleMap.map(({ name, value }) => (
                <option key={name} value={select.indexOf(value)}>
                    {name}
                </option>
            )),
        [form.titleMap, select]
    );
    return (
        <div>
            {form.title && <p>{form.title}</p>}
            {(error || form.description) && <p>{error || form.description}</p>}
            <select onChange={onChange} value={value}>
                {options}
            </select>
        </div>
    );
}
