import React from 'react';

export default function Date(props) {
    const { form, onChange } = props;
    return (
        <div>
            {form.title && <label>{form.title}</label>}
            <input type="date" onChange={onChange} />
            {form.description && <p>{form.description}</p>}
        </div>
    );
}
