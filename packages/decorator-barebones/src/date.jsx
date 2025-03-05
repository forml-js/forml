import React from 'react';

export default function Date(props) {
    const { form } = props;
    return (
        <div>
            {form.title && <label>{form.title}</label>}
            <input type="date" {...props} />
            {form.description && <p>{form.description}</p>}
        </div>
    );
}
