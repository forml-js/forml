import * as MUI from '@material-ui/core';
import {createElement as h} from 'react';

export function form(props) {
    return h(MUI.Input, props);
}

export function group(props) {
    return h(MUI.FormControl, props);
}

export function description(props) {
    return h(MUI.FormHelperText, props);
}

export function select(props) {
    return h(MUI.Select, props);
}

export function option(props) {
    return h(MUI.MenuItem, props);
}
