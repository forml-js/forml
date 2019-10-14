import * as MUI from '@material-ui/core';
import {createElement as h, Fragment, useState} from 'react';

export default function items(props) {
    return h(Fragment, {}, [
        h(MUI.Button, {onClick: props.add}, h(MUI.IconButton, {}, h(MUI.Icon, {}, 'add'))),
        h(MUI.List, {}, props.children)
    ]);
}
