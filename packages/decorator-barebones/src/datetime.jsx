import React from 'react';

export default function DateTime(props) {
    const { form } = props;
    return (
        <div>
            {form.title && <label>{form.title}</label>}
            <input type="datetime-local" {...props} />
            {form.description && <p>{form.description}</p>}
        </div>
    );
}
