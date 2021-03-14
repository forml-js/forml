import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: 1,
        '&$horizontal': {
            flexDirection: 'row',
        },
        '&$vertical': {
            flexDirection: 'column',
        },
    },
    content: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    panels: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    tabs: {
        display: 'flex',
        flex: '0 0 auto',
        zIndex: 10,
        alignItems: 'flex-start',
        whiteSpace: 'nowrap',
        '&$vertical': {
            flexDirection: 'row',
            borderBottom: '1px solid black',
            borderBottomColor: theme.palette.divider,
        },
        '&$horizontal': {
            flex: '0 0 auto',
            flexDirection: 'column',
            borderRight: '1px solid black',
            borderRightColor: theme.palette.divider,
            '&$collapse': {
                overflow: 'hidden',
                maxWidth: theme.spacing(7),
                transition: 'all 0.6s',
                '&:hover': {
                    maxWidth: '100%'
                },
            },
        },
    },
    collapse: {},
    vertical: {},
    horizontal: {},
    title: {
        flex: '0 0 0',
        '$vertical>&': {
            borderRight: '1px solid black',
            borderRightColor: theme.palette.divider,
        },
    },
}));

/**
 * @component
 */
export default function Container(props) {
    const { title, description, form } = props;
    const classes = useStyles(props);

    const layout = 'layout' in form ? form.layout : 'vertical';
    const collapse = 'collapse' in form ? form.collapse : false;

    return (
        <Paper className={clsx(classes.root, classes[layout])}>
            {(title || description) && (
                <List className={classes.titleRoot} dense disablePadding>
                    <ListItem
                        key="tab-bar"
                        className={classes.title}
                        divider
                    >
                        <ListItemIcon key="icon">
                            <Icon fontSize="small">view_carousel</Icon>
                        </ListItemIcon>
                        <ListItemText
                            key="title"
                            primaryTypographyProps={{
                                variant: 'subtitle2',
                                color: 'textPrimary',
                                noWrap: true,
                            }}
                            primary={title}
                            secondaryTypographyProps={{
                                variant: 'caption',
                                noWrap: true,
                            }}
                            secondary={description}
                        />
                    </ListItem>
                </List>
            )}
            <List
                className={clsx(
                    classes.tabs,
                    classes[layout],
                    {
                        [classes.collapse]: collapse
                    }
                )}
                dense
                disablePadding
            >
                {props.tabs}
            </List>
            <div key="tab-panel" className={classes.panels}>
                {props.panels}
            </div>
        </Paper>
    );
}
