import * as MUI from '@material-ui/core';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Tab(props) {
    const {label}    = props;
    const {activate} = props;

    console.error('Tab() : label : %o', label);

    return h(MUI.Tab, {onClick: activate, label}, label);
}
