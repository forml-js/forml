import {createElement as h} from 'react';

export default function Group(props) {
    const {form} = props;
    return h('div', {className: form.htmlClass}, props.children);
}

