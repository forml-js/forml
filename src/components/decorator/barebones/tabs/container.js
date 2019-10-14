import {createElement as h} from 'react';

export default function container(props) {
    return h('div', {className: 'tabs-container'}, [
        h('div', {className: 'tabs'}, props.tabs),
        h('div', {className: 'panels'}, props.panels),
    ]);
}
