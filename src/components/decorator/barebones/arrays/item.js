import t from 'prop-types';
import { createElement as h, forwardRef } from 'react';
import clsx from 'clsx';

/**
 * @component
 */
export function Item(props, ref) {
    const { otherProps } = props;
    const { draggableProps, dragHandleProps } = otherProps;
    return h(
        'li',
        {
            ...draggableProps,
            className: clsx(draggableProps.className, 'item'),
            ref,
        },
        [
            h('div', { key: 'controls', className: 'controls' }, [
                h(
                    'h6',
                    { key: 'title', ...dragHandleProps, className: 'title' },
                    props.title
                ),
                h(
                    'button',
                    {
                        key: 'move-up',
                        onClick: props.moveUp,
                        className: 'move-up',
                    },
                    'move up'
                ),
                h(
                    'button',
                    {
                        key: 'move-down',
                        onClick: props.moveDown,
                        className: 'move-down',
                    },
                    'move down'
                ),
                h(
                    'button',
                    {
                        key: 'delete',
                        onClick: props.destroy,
                        className: 'delete',
                    },
                    'delete'
                ),
            ]),
            h('div', { key: 'content', className: 'content' }, props.children),
        ]
    );
}

export default forwardRef(Item);

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
};
