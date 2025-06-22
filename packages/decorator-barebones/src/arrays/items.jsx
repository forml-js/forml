import React, { forwardRef } from 'react';

/**
 * @component
 */
function Items(props, ref) {
    const { form } = props;
    const disabled = form.readonly ?? false;

    return (
        <div className="array" ref={ref}>
            <button
                key="add"
                className="add"
                disabled={disabled}
                onClick={props.add}
            >
                {form.addText}
            </button>
            <ul key="items">{props.children}</ul>
        </div>
    );
}

export default forwardRef(Items);
