import t from 'prop-types';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Item(props) {
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

Item.propTypes = {
    /**
     * Moves this item up one index in the array
     */
    moveUp: t.func,
    /**
     * Moves this item down one index in the array
     */
    moveDown: t.func,
    /**
     * Destroys this item
     */
    destroy: t.func,
    /**
     * The child form to be rendered
     */
    children: t.elementType,
}
