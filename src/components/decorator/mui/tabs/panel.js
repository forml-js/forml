import * as MUI from '@material-ui/core';
import {createElement as h, useState} from 'react';

/**
 * @component
 */
export default function Panel(props) {
    const {active} = props;

    if (!active)
        return null;

    return h('div', {}, props.children);
}
