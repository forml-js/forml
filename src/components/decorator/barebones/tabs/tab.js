import {createElement as h} from 'react';

export default function tab(props) {
    const {form}  = props;
    const {title} = form;
    return h('button', {onClick: props.activate}, title);
}

