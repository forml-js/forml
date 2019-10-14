import * as MUI from '@material-ui/core';
import {createElement as h, useState} from 'react';

export default function tab(props) {
    const {label}    = props;
    const {activate} = props;

    return h(MUI.Tab, {onClick: activate, label}, label);
}
