import * as MUI from '@material-ui/core';
import {createElement as h, useState} from 'react';

export default function group(props) {
    const {form}             = props;
    const {fullWidth = true} = form;
    return h(MUI.FormGroup, {fullWidth, ...form.otherProps}, props.children);
}
