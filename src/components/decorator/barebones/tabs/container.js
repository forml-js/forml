import { createElement as h } from 'react';

/**
 * @component
 */
export default function Container(props) {
    return h('div', { className: 'tabs-container' }, [
        h('div', { className: 'tabs', key: 'tabs' }, props.tabs),
        h('div', { className: 'panels', key: 'panels' }, props.panels),
    ]);
}
