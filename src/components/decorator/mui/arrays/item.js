import * as MUI from '@material-ui/core';
import {createElement as h, Fragment, useState} from 'react';

export default function Item(props) {
    const [open, setOpen] = useState(false);

    return h(Fragment, {}, [
        h(MUI.ListItem,
          {button: true, divider: true, onClick: toggle},
          [
              h(MUI.ListItemText, {primary: props.title}),
              h(MUI.ListItemSecondaryAction,
                {},
                [
                    h(MUI.IconButton, {onClick: props.moveUp}, h(MUI.Icon, {}, 'arrow_upward')),
                    h(MUI.IconButton, {onClick: props.moveDown}, h(MUI.Icon, {}, 'arrow_downward')),
                    h(MUI.IconButton, {onClick: props.destroy}, h(MUI.Icon, {}, 'delete_forever')),
                ]),
          ]),
        h(MUI.Collapse, {'in': open}, props.children),
    ]);

    function toggle() {
        setOpen(!open);
    }
}
