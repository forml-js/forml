import React from 'react';

export default function Select({ value, children, onChange }) {
    return (
        <select onChange={onChange} value={value}>
            {children}
        </select>
    );
}
