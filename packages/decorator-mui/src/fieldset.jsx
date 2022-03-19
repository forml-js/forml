import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';

/**
 * @component
 */
const useStyles = makeStyles(function (theme) {
    return {
        paper: {
            flex: 1,
            flexDirection: 'inherit',
            margin: theme.spacing?.(1),
        },
        root: {
            padding: theme.spacing?.(1),
            minWidth: '0',
            flex: 1,
        },
        disableMargin: {
            margin: theme.spacing?.(0),
        },
        disablePadding: {
            '&$vertical, &$horizontal': {
                marginTop: theme.spacing?.(0),
                marginBottom: theme.spacing?.(0),
                paddingTop: theme.spacing?.(0),
                paddingBottom: theme.spacing?.(0),
            },
            marginTop: theme.spacing?.(0),
            marginBottom: theme.spacing?.(0),
            paddingTop: theme.spacing?.(0),
            paddingBottom: theme.spacing?.(0),
        },
        alignItems: (props) => {
            const { form } = props;
            const alignItems =
                'alignItems' in form ? form.alignItems : 'flex-start';
            return { alignItems };
        },
        horizontal: {
            display: 'flex',
            flexDirection: 'row',
            padding: theme.spacing?.(1.0),
            maxWidth: 'fill-available',
        },
        vertical: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing?.(1.0),
            maxWidth: 'fill-available',
        },
        title: {
            display: 'flex',
            flexDirection: 'column',
        },
        formLabel: {},
        formHelperText: {
            color: theme.palette?.text?.primary,
        },
        icon: {
            display: 'inline-flex',
            minWidth: theme.spacing?.(6),
            color: theme.palette?.action?.active,
        },
        header: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing?.(1.0, 2.0),
            borderBottom: '1px solid black',
            borderBottomColor: theme.palette?.divider,
            marginBottom: theme.spacing?.(0.5),
        },
    };
});
const Root = styled(List)(({ theme, disablePadding }) => [
    {
        flexDirection: 'column',
    },
]);
const Content = styled(Box)(({ theme, disablePadding, disableMargin }) => [
    {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    disablePadding && {
        padding: 0,
    },
    disableMargin && {
        margin: 0,
    },
]);
const Surface = styled(Paper)(({ theme, disableMargin }) => [
    {
        flex: 1,
        flexDirection: 'inherit',
        m: 1,
    },
    disableMargin && { m: 0 },
]);

export default function FieldSet(props) {
    const { title, description, form } = props;

    const layout = 'layout' in form ? form.layout : 'vertical';
    const disablePadding =
        'disablePadding' in form ? form.disablePadding : false;
    const disableMargin = 'disableMargin' in form ? form.disableMargin : false;
    const Component = 'component' in form ? form.component : 'div';
    const elevation = 'elevation' in form ? form.elevation : 1;
    const icon = 'icon' in form ? form.icon : null;

    let content = (
        <Root dense disablePadding>
            {(title || description) && (
                <ListItem disablePadding={disablePadding} divider>
                    {icon && (
                        <ListItemIcon>
                            <Icon key="icon">{icon}</Icon>
                        </ListItemIcon>
                    )}
                    <ListItemText
                        key="title"
                        primary={title}
                        primaryTypographyProps={{ noWrap: true }}
                        secondary={description}
                        secondaryTypographyProps={{
                            nowrap: true,
                            variant: 'caption',
                        }}
                    />
                </ListItem>
            )}
            <Content
                component={Component}
                disableMargin={disableMargin}
                disablePadding={disablePadding}
            >
                {props.children}
            </Content>
        </Root>
    );

    if (title || description) {
        content = (
            <Surface disableMargin={disableMargin} elevation={elevation}>
                {content}
            </Surface>
        );
    }

    return content;
}
