import * as MUI from '@material-ui/core';
import {createElement as h, useState} from 'react';

export default function container(props) {
    const {value} = props;
    return h('div', {}, [
        h(MUI.AppBar, {key: 'tab-bar', position: 'static'}, h(MUI.Tabs, {value}, props.tabs)),
        h('div', {key: 'tab-panel'}, props.panels),
    ]);
}
