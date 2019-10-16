import t from 'prop-types';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function FieldSet(props) {
    return h('fieldset', {}, [
        h('legend', {}, props.title),
        props.children,
    ]);
}

FieldSet.propTypes = {
    /**
     * The localized title for the fieldset
     */
    title: t.string,
}
