import t from 'prop-types';
import React from 'react';

/**
 * @component
 */
export default function FieldSet(props) {
    return (
        <fieldset>
            {props.title && <legend>{props.title}</legend>}
            {props.description && <p>{props.description}</p>}
            <div>{props.children}</div>
        </fieldset>
    );
}

FieldSet.propTypes = {
    /**
     * The localized title for the fieldset
     */
    title: t.string,
};
