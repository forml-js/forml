import { useArrayKeyRange } from '@forml/hooks';
import { Item } from './Item.jsx';
import React from 'react';

export function Range(props) {
    const { start, end, form, dragType, onChange } = props;
    const keys = useArrayKeyRange(form.key, start, end);
    const items = keys.map((key, index) => {
        return (
            <Item
                key={key}
                id={key}
                index={start + index}
                dragType={dragType}
                onChange={onChange}
                form={form}
            />
        );
    });
    return <>{items}</>;
}
