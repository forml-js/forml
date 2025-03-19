import { useArrayKeyRange } from '@forml/hooks';
import { Item } from './Item.jsx';
import React, { useMemo } from 'react';

export function Range(props) {
    const { start, end, form, onChange } = props;
    const keys = useArrayKeyRange(form.key, start, end);
    const items = keys.map((key, index) => {
        return <Item key={key} id={key} onChange={onChange} form={form} />;
    });
    return <>{items}</>;
}
