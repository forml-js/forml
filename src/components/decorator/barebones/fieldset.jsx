import t from 'prop-types';
import React from 'react';

/**
 * @component
 */
export default function FieldSet(props) {
    return (
        <fieldset>
            <legend>{props.title}</legend>
            {props.children}
        </fieldset>
    );
}

FieldSet.propTypes = {
    /**
     * The localized title for the fieldset
     */
    title: t.string,
};
