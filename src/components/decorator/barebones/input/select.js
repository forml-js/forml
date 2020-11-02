import { createElement as h, useRef } from 'react';

export default function Select({ value, children, onChange }) {
    return h('select', { onChange, value }, children);
}
