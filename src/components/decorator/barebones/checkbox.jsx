import * as Input from './input';
import React from 'react';

/**
 * @component
 */
export default function Checkbox({
    title,
    description,
    error,
    checked,
    onChange,
}) {
    return (
        <div>
            <label key="label">
                <input
                    key="input"
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />{' '}
                {title}
            </label>
            {(error || description) && (
                <Input.Description key="description">
                    {error || description}
                </Input.Description>
            )}
        </div>
    );
}
