import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {createElement as h} from 'react';

const useStyles = makeStyles(function(theme) {
    return {
        root: {
            margin: theme.spacing(1),
        },
        title: {flexGrow: 1},
    };
});

/**
 * @component
 */
export default function Items(props) {
    const {label}              = props;
    const {error, description} = props;

    const classes = useStyles();
    const color   = error ? 'error' : 'initial';

    return h(
        Card, {className: classes.root}, h(FormControl, {fullWidth: true, error: !!error}, [
            h(AppBar,
              {position: 'static'},
              h(Toolbar,
                {variant: 'dense'},
                [
                    label && h(Typography, {className: classes.title, color, variant: 'h6'}, label),
                    h(IconButton, {onClick: props.add, color}, h(Icon, {}, 'add')),
                ])),
            (error || description) &&
                h(CardContent, {}, h(Typography, {variant: 'body1', color}, error || description)),
            h(List, {}, props.children),
        ]));
}
