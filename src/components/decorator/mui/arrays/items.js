import * as MUI from '@material-ui/core';
import {createElement as h, Fragment, useState} from 'react';

const useStyles = MUI.makeStyles(function(theme) {
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
        MUI.Paper,
        {className: classes.root},
        h(MUI.FormControl, {fullWidth: true, error: !!error}, [
            h(MUI.AppBar,
              {position: 'static'},
              h(MUI.Toolbar,
                {variant: 'dense'},
                [
                    label &&
                        h(MUI.Typography, {className: classes.title, color, variant: 'h6'}, label),
                    h(MUI.IconButton, {onClick: props.add, color}, h(MUI.Icon, {}, 'add')),
                ])),
            (error || description) &&
                h(MUI.CardContent,
                  {},
                  h(MUI.Typography, {variant: 'body1', color}, error || description)),
            h(MUI.List, {}, props.children),
        ]));
}
