import {createElement as h} from 'react';

export default function group(props) {
    const {form} = props;
    return h('div', {className: form.htmlClass}, props.children);
}

