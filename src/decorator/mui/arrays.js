import * as MUI from '@material-ui/core';
import debug from 'debug';
import {createElement as h, Fragment, useState} from 'react';

const log = debug('rjsf:decorators:mui:arrays');

export function item(props) {
    const [open, setOpen] = useState(false);

    log('item() : props : %o', props);

    return h(Fragment, {}, [
        h(MUI.ListItem,
          {button: true, divider: true, onClick: toggle},
          [
              h(MUI.ListItemText, {primary: props.title}),
              h(MUI.ListItemSecondaryAction,
                {},
                h(MUI.IconButton, {onClick: props.destroy}, h(MUI.Icon, {}, 'delete_forever'))),
          ]),
        h(MUI.Collapse, {'in': open}, props.children),
    ]);

    function toggle() {
        setOpen(!open);
    }
}

export function items(props) {
    return h(Fragment, {}, [
        h(MUI.Button, {onClick: props.add}, h(MUI.IconButton, {}, h(MUI.Icon, {}, 'add'))),
        h(MUI.List, {}, props.children)
    ]);
}
