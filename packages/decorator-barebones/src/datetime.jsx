import React from 'react';

export default function DateTime(props) {
    const { form, onChange, value } = props;

    return (
        <div>
            {form.title && <label>{form.title}</label>}
            <input type="text" value={value} onChange={onChange} />
            {form.description && <p>{form.description}</p>}
        </div>
    );
}
