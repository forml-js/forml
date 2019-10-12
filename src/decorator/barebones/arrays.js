import {createElement as h} from 'react';

export function item(props) {
    return h('li', {}, [
        h('div',
          {},
          [
              h('h6', props.title),
              h('button', {onClick: props.destroy}, 'delete'),
          ]),
        h('div', {}, props.children),
    ]);
}

export function items(props) {
    return h('div', {}, [
        h('button', {onClick: props.add}, 'add'),
        h('ul', {}, props.children),
    ]);
}
