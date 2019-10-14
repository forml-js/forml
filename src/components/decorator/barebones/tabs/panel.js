import {createElement as h} from 'react';

export default function panel(props) {
    if (!props.active)
        return null;
    return h('div', {}, props.children);
}
