import * as MUI from '@material-ui/core';
import {createElement as h} from 'react';

export default function Group(props) {
    const fullWidth = true;
    return h(MUI.FormControl, {...props, fullWidth}, props.children);
}