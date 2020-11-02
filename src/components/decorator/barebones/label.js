import { createElement as h } from 'react';
export default (props) =>
    h('label', { htmlFor: props.htmlFor }, props.children);
