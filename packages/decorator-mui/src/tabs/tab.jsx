import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/styles';
import React, { useRef } from 'react';

const ImageIcon = styled('img')(({ theme, ...props }) => ({
    objectFit: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: theme.spacing(7),
    maxHeight: theme.spacing(3),
    overflow: 'hidden',
}));
const Root = styled(ListItem)(({ theme, parent, active, form }) => [
    parent.collapse &&
        parent.layout !== 'horizontal' && {
            maxWidth: theme.spacing(7),
        },
    parent.collapse &&
        (parent.layout === 'horizontal' || active) && {
            maxWidth: '100%',
        },
    {
        flexBasis: 'min-content',
        flexGrow: 0,
        flexShrink: 1,
        minHeight: theme.spacing(7),
        minWidth: theme.spacing(7),
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s',
        ':hover': {
            maxWidth: '100vh',
        },
    },
    parent.layout === 'horizontal' && {
        ':after': {
            borderRight: '0px solid black',
            borderRightColor: theme.palette.primary.main,
            bottom: 0,
            content: '""',
            display: 'block',
            left: 'auto',
            position: 'absolute',
            right: 0,
            top: 0,
            transform: 'translateX(1px)',
            transition: 'border 0.3s',
            zIndex: 100,
        },
        ':hover': {
            ':after': {
                borderRightWidth: theme.spacing(0.5),
            },
        },
    },
    parent.layout !== 'horizontal' && {
        ':after': {
            borderBottom: '0px solid black',
            borderBottomColor: theme.palette.primary.main,
            bottom: 0,
            content: '""',
            display: 'block',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 'auto',
            transform: 'translateY(1px)',
            transition: 'border 0.3s',
            zIndex: 10,
        },
        ':hover': {
            ':after': {
                borderBottomWidth: theme.spacing(0.5),
            },
        },
    },
    active &&
        parent.layout === 'horizontal' && {
            ':after': {
                borderRightWidth: theme.spacing(0.5),
            },
        },
    active &&
        parent.layout !== 'horizontal' && {
            ':after': {
                borderBottomWidth: theme.spacing(0.5),
            },
        },
]);

/**
 * @component
 */
export default function Tab(props) {
    const { title, description } = props;
    const { activate, active } = props;
    const { form, parent } = props;

    const icon = 'icon' in form ? form.icon : 'dynamic_form';
    const image = 'image' in form ? form.image : null;

    let imageOrIcon = null;
    if (image) {
        imageOrIcon = (
            <ListItemIcon>
                <ImageIcon src={image} />
            </ListItemIcon>
        );
    } else if (icon) {
        imageOrIcon = (
            <ListItemIcon key="icon">
                <Icon>{icon}</Icon>
            </ListItemIcon>
        );
    }

    return (
        <Root
            parent={parent}
            form={form}
            active={active}
            button
            divider={parent.layout === 'horizontal'}
            onClick={activate}
        >
            {imageOrIcon}
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
        </Root>
    );
}
