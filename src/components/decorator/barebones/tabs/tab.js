import {createElement as h} from 'react';

/**
 * @component
 */
export default function Tab(props) {
    const {form}  = props;
    const {title} = form;
    return h('button', {onClick: props.activate}, title);
}

