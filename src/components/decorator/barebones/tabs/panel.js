import { createElement as h } from 'react';

/**
 * @component
 */
export default function Panel(props) {
    if (!props.active) return null;

    const { active, children } = props;
    return h('div', { active }, children);
}
