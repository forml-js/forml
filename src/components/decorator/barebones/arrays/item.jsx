import t from 'prop-types';
import React, { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * @component
 * @return {React.Component}
 */
export function Item(props, ref) {
    const { otherProps, disabled } = props;
    const { draggableProps, dragHandleProps } = otherProps;
    return (
        <li
            {...draggableProps}
            className={clsx(draggableProps.className, 'item')}
            ref={ref}
        >
            <div key="controls" className="controls">
                <h6 key="title" {...dragHandleProps} className="title">
                    {props.title}
                </h6>
                <button
                    key="move-up"
                    onClick={props.moveUp}
                    className="move-up"
                    disabled={disabled}
                >
                    move up
                </button>
                <button
                    key="move-down"
                    onClick={props.moveDown}
                    className="move-down"
                    disabled={disabled}
                >
                    move down
                </button>
                <button
                    key="delete"
                    onClick={props.destroy}
                    className="delete"
                    disabled={disabled}
                >
                    delete
                </button>
            </div>
            <div key="content" className="content">
                {props.children}
            </div>
        </li>
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
