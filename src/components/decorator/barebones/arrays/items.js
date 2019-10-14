import {createElement as h} from 'react';

export default function items(props) {
    return h('div', {}, [
        h('button', {onClick: props.add}, 'add'),
        h('ul', {}, props.children),
    ]);
}
