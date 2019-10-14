import {createElement as h} from 'react';

/**
 * @component
 */
export default function Items(props) {
    return h('div', {}, [
        h('button', {onClick: props.add}, 'add'),
        h('ul', {}, props.children),
    ]);
}
