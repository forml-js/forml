import * as MUI from '@material-ui/core';
import {createElement as h} from 'react';

export default function Option(props) {
    return h(MUI.MenuItem, props);
}