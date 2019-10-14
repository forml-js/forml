import {createElement as h} from 'react';

export default function item(props) {
    return h('li', {}, [
        h('div',
          {},
          [
              h('h6', props.title),
              h('button', {onClick: props.moveUp}, 'move up'),
              h('button', {onClick: props.moveDown}, 'move down'),
              h('button', {onClick: props.destroy}, 'delete'),
          ]),
        h('div', {}, props.children),
    ]);
}
