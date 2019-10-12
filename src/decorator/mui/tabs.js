import * as MUI from '@material-ui/core';
import {createElement as h, useState} from 'react';
import {useLocalizer} from '../../context';

export function container(props) {
    const {value} = props;
    return h('div', {}, [
        h(MUI.AppBar, {key: 'tab-bar', position: 'static'}, h(MUI.Tabs, {value}, props.tabs)),
        h('div', {key: 'tab-panel'}, props.panels),
    ])
}

export function tab(props) {
    const {form}  = props;
    const {activate} = props;
    const {title} = form;

    const localizer = useLocalizer();
    const label     = localizer.getLocalizedString(form.title);

    return h(MUI.Tab, {onClick: activate, label});
}

export function panel(props) {
    const {active} = props;
    if (!active)
        return null;

    return h('div', {}, props.children);
}
