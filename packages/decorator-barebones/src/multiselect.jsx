import React, { useCallback, useMemo } from 'react';
import { useSelect, useError } from '@forml/hooks';

export default function Multiselect(props) {
    const { form } = props;
    const select = useSelect(form);
    const value = useMemo(() => {
        if (Array.isArray(props.value)) {
            return props.value.map((value) => select.indexOf(value));
        } else {
            return [select.indexOf(props.value)];
        }
    }, [props.value]);
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
            <select onChange={onChange} value={value} multiple>
                {options}
            </select>
        </div>
    );
}
