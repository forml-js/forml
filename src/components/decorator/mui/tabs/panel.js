import {createElement as h} from 'react';

/**
 * @component
 */
export default function Panel(props) {
    const {active} = props;

    if (!active)
        return null;

    return h('div', {}, props.children);
}
