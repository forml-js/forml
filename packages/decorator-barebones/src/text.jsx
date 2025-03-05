import React from 'react';
import { useError } from '@forml/hooks';
export default (props) => {
    const { value, form, onChange } = props;
    const error = useError(form.key);
    return (
        <div>
            {form.title && <label>{form.title}</label>}
            <input type="text" value={value} onChange={onChange} />
            {(error || form.description) && <p>{error || form.description}</p>}
        </div>
    );
};
