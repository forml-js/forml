import React, { useCallback } from 'react';
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
    return (
        <div>
            {form.title && <p>{form.title}</p>}
            {(error || form.description) && <p>{error || form.description}</p>}
            <select onChange={onChange} value={value}>
                {props.children}
            </select>
        </div>
    );
}
