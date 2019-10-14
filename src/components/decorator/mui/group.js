import * as MUI from '@material-ui/core';
import {createElement as h, useState} from 'react';

/**
 * @component
 */
export default function Group(props) {
    const {form}             = props;
    const {fullWidth = true} = form;
    return h(MUI.FormGroup, {fullWidth, ...form.otherProps}, props.children);
}
