import t from 'prop-types';
import React, { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * @component
 * @return {React.Component}
 */
export function Item(props, ref) {
    const { form, dragRef, handleRef } = props;
    const disabled = form.readonly ?? false;
    return (
        <li className="item" ref={ref}>
            <div key="dragHandle" className="handle" ref={handleRef} />
            <div key="controls" className="controls">
                <h6 key="title" className="title">
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
