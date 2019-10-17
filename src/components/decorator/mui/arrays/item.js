import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import {createElement as h, Fragment, useState} from 'react';

const useStyles = makeStyles(function(theme) {
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

    const title = h(Typography, {variant: 'subtitle1'}, [
        ` [${index}] `,
        props.title,
    ]);

    return h(Fragment, {}, [
        h(ListItem,
          {button: true, divider: true, onClick: toggle},
          [
              h(Icon,
                {
                    className: clsx(classes.expansionIcon, {[classes.expansionIconActive]: open}),
                },
                'chevron_right'),
              h(ListItemText, {primary: title}),
              h(ListItemSecondaryAction,
                {},
                [
                    h(IconButton, {onClick: props.moveUp}, h(Icon, {}, 'arrow_upward')),
                    h(IconButton, {onClick: props.moveDown}, h(Icon, {}, 'arrow_downward')),
                    h(IconButton, {onClick: props.destroy}, h(Icon, {}, 'delete_forever')),
                ]),
          ]),
        h(Collapse, {className: {[classes.contentOpen]: open}, 'in': open}, props.children),
    ]);

    function toggle() {
        setOpen(!open);
    }
}
