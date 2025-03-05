import React, { useCallback, useRef } from 'react';
import { useError, useFileField } from '@forml/hooks';

export default function File(props) {
    const { form, value } = props;
    const fileField = useFileField(form);
    const ref = useRef(null);
    const onChange = useCallback(
        (event) => {
            const result = fileField.onChange(event);
            props.onChange(
                { ...event, target: { ...event.target, value } },
                result
            );
        },
        [fileField.onChange, props.onChange]
    );
    const onClear = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            const result = fileField.onChange({
                ...event,
                target: { ...event.target, files: [] },
            });
            props.onChange(
                { ...event, target: { ...event.target, value: result } },
                null
            );
        },
        [fileField.onChange, props.onChange]
    );
    const onClick = useCallback((event) => ref.current?.click(), [ref]);
    const error = useError(form.key);
    return (
        <div>
            {form.title && <label>{form.title}</label>}
            <input
                style={{ display: 'none' }}
                type="file"
                ref={ref}
                onChange={onChange}
            />
            <input type="text" value={fileField.display} readOnly />
            <button onClick={onClick}>Choose File</button>
            <button onClick={onClear}>Reset</button>
            {(error || form.description) && <p>{form.description}</p>}
        </div>
    );
}
