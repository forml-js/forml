import { useError } from '@forml/hooks';
import React from 'react';

/**
 * @component
 */
export default function Checkbox({ form, value, onChange }) {
    const title = 'titleFun' in form ? form.titleFun(value) : form.title;
    const description = 'description' in form ? form.description : null;
    const error = useError();
    const checked = value;
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
                <p key="description">{error || description}</p>
            )}
        </div>
    );
}
