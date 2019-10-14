import * as MUI from '@material-ui/core';
import {createElement as h} from 'react';

export default function group(props) {
    const fullWidth = true;
    return h(MUI.FormControl, {...props, fullWidth}, props.children);
}
