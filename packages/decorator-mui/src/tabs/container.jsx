import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';

const GapProvider = function (props) {
    const { target } = props;
    const height = target?.scrollHeight; // Scroll height to get true element height
    const width = target?.offsetWidth; // Offset width to get assumed width
    console.log('GapProvider(target: %o)', target);
    return (
        <div
            style={{
                display: 'flex',
                minHeight: `${height}px`,
                minWidth: `${width}px`,
                flex: 0,
            }}
        />
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
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
        zIndex: 5,
    },
    tabs: {
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flex: '0 0 auto',
        zIndex: 10,
        alignItems: 'flex-start',
        whiteSpace: 'nowrap',
        '&$vertical': {
            flexDirection: 'row',
            borderBottom: '1px solid black',
            borderBottomColor: theme.palette?.divider,
            right: 0,
            bottom: 'auto',
        },
        '&$horizontal': {
            bottom: 0,
            right: 'auto',
            flex: '0 0 auto',
            flexDirection: 'column',
            borderRight: '1px solid black',
            borderRightColor: theme.palette?.divider,
            '&$collapse': {
                overflow: 'hidden',
                maxWidth: theme.spacing?.(7),
                transition: 'all 0.3s',
                '&:hover': {
                    maxWidth: '100%',
                },
            },
        },
    },
    collapse: {},
    content: {
        position: 'relative',
    },
    titleRoot: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
    },
    horizontal: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    },
    vertical: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    title: {
        flex: '0 0 0',
        '$vertical>&': {
            borderRight: '1px solid black',
            borderRightColor: theme.palette?.divider,
        },
    },
}));

/**
 * @component
 */
export default function Container(props) {
    const { title, description, form } = props;
    const classes = useStyles(props);
    const [target, setTarget] = useState(null);
    const ref = useCallback((nextTarget) => {
        console.log('Container(nextTarget: %o)', nextTarget);
        setTarget(nextTarget);
    });

    const layout = 'layout' in form ? form.layout : 'vertical';
    const collapse = 'collapse' in form ? form.collapse : false;
    const icon = 'icon' in form ? form.icon : 'view_carousel';

    return (
        <Paper className={classes.root}>
            {(title || description) && (
                <List className={classes.titleRoot} dense disablePadding>
                    <ListItem key="tab-bar" className={classes.title} divider>
                        <ListItemIcon key="icon">
                            <Icon fontSize="small">{icon}</Icon>
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
            <div className={clsx(classes.content, classes[layout])}>
                <Paper
                    ref={ref}
                    banana="farm"
                    square
                    elevation={0}
                    className={clsx(classes.tabs, classes[layout], {
                        [classes.collapse]: collapse,
                    })}
                >
                    <List dense disablePadding>
                        {props.tabs}
                    </List>
                </Paper>
                {collapse && <GapProvider target={target} />}
                <div key="tab-panel" className={clsx(classes.panels)}>
                    {props.panels}
                </div>
            </div>
        </Paper>
    );
}
