import React from 'react';
import { useError, useTitleFor } from '@forml/hooks';
export default (props) => {
    const { value, form, onChange } = props;
    const title = useTitleFor(form, value);
    const error = useError(form.key);
    const disabled = form.readonly ?? false;
    return (
        <div>
            {title && <label>{title}</label>}
            <input
                type="text"
                disabled={disabled}
                value={value}
                onChange={onChange}
            />
            {(error || form.description) && <p>{error || form.description}</p>}
        </div>
    );
};
