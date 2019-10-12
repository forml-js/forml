import {createElement as h} from 'react';
export function container(props) {
    return h('div', {className: 'tabs-container'}, [
        h('div', {className: 'tabs'}, props.tabs),
        h('div', {className: 'panels'}, props.panels),
    ]);
}

export function tab(props) {
    const {form}  = props;
    const {title} = form;
    return h('button', {onClick: props.activate}, title);
}

export function panel(props) {
    if (!props.active)
        return null;
    return h('div', {}, props.children);
}
