import React, { forwardRef } from 'react';
import { useLocalizer } from '../../../../context';

/**
 * @component
 */
function Items(props, ref) {
    const { getLocalizedString } = useLocalizer();
    const { disabled } = props;
    return (
        <div className="array" ref={ref}>
            <button
                key="add"
                className="add"
                disabled={disabled}
                onClick={props.add}
            >
                {getLocalizedString('Add Item')}
            </button>
            <ul key="items">{props.children}</ul>
        </div>
    );
}

export default forwardRef(Items);
