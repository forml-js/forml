import * as MUI from '@material-ui/core';
import clsx from 'clsx';
import {createElement as h, Fragment, useState} from 'react';

const useStyles = MUI.makeStyles(function(theme) {
    return {
        title: {},
        expansionIcon: {
            transition: 'all 0.3s',
        },
        expansionIconActive: {
            transform: 'rotate(90deg)',
        },
        contentOpen: {
            padding: theme.spacing(2),
        }
    };
});
/**
 * @component
 */
export default function Item(props) {
    const [open, setOpen] = useState(false);
    const classes         = useStyles();
    const {index}         = props;

    const title = h(MUI.Typography, {variant: 'subtitle1'}, [
        ` [${index}] `,
        props.title,
    ]);

    return h(Fragment, {}, [
        h(MUI.ListItem,
          {button: true, divider: true, onClick: toggle},
          [
              h(MUI.Icon,
                {
                    className: clsx(classes.expansionIcon, {[classes.expansionIconActive]: open}),
                },
                'chevron_right'),
              h(MUI.ListItemText, {primary: title}),
              h(MUI.ListItemSecondaryAction,
                {},
                [
                    h(MUI.IconButton, {onClick: props.moveUp}, h(MUI.Icon, {}, 'arrow_upward')),
                    h(MUI.IconButton, {onClick: props.moveDown}, h(MUI.Icon, {}, 'arrow_downward')),
                    h(MUI.IconButton, {onClick: props.destroy}, h(MUI.Icon, {}, 'delete_forever')),
                ]),
          ]),
        h(MUI.Collapse, {className: {[classes.contentOpen]: open}, 'in': open}, props.children),
    ]);

    function toggle() {
        setOpen(!open);
    }
}
