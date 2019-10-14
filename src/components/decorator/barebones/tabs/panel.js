import {createElement as h} from 'react';

export default function Panel(props) {
    if (!props.active)
        return null;
    return h('div', {}, props.children);
}
