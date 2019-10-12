import {createElement as h} from 'react';

export function form(props) {
    const {form}    = props;
    const type      = form.type;
    const value     = props.value;
    const onChange  = props.onChange;
    return h('input', {type, value, onChange})
}

export function group(props) {
    const {form} = props;
    return h('div', {className: form.htmlClass}, props.children);
}

export function select(props) {
    return h('select', props);
}

export function option(props) {
    return h('option', props);
}

export const description = 'p';
