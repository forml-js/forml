import React from 'react';

/**
 * @component
 */
export default function Form(props) {
    const value = props.value;
    const onChange = props.onChange;
    const disabled = props.disabled;
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    );
}
