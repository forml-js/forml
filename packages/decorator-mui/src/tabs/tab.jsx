import { styled } from '@mui/material';
import Icon from '@mui/material/Icon';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useMemo } from 'react';

const ImageIcon = styled('img')(({ theme, ...props }) => ({
    objectFit: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: theme.spacing(7),
    maxHeight: theme.spacing(3),
    overflow: 'hidden',
}));
const Root = styled(ListItem)(({ theme, parent, active, form }) => [
    {
        minHeight: theme.spacing(7),
        minWidth: theme.spacing(7),
        overflow: 'hidden',
        position: 'relative',
        transition: theme.transitions.create(),
        opacity: theme.palette.action.disabledOpacity,
        ':hover': {
            opacity: 1,
        },
        ':after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            right: 0,
            top: 0,
            left: 0,
            bottom: 0,
            transition: theme.transitions.create(),
            zIndex: 100,
        },
    },

    active && {
        opacity: 1,
    },

    // Collapse modifications
    parent.collapse && {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 'min-content',
        maxWidth: theme.spacing(7),
    },
    // Collapse modifications: vertical layout
    parent.collapse &&
        parent.layout !== 'horizontal' && {
            flexGrow: 0,
            flexShrink: 0,
            ':hover': {
                flexBasis: 'min-content',
                flexGrow: 0,
                flexShrink: 0,
                maxWidth: '100%',
            },
        },
    active &&
        parent.collapse &&
        parent.layout !== 'horizontal' && {
            flexBasis: 'min-content',
            flexGrow: 0,
            flexShrink: 0,
            maxWidth: '100%',
        },

    parent.collapse &&
        parent.layout === 'horizontal' && {
            maxWidth: '100%',
            flexGrow: 1,
        },

    parent.layout === 'horizontal' && {
        ':after': {
            left: 'auto',
            width: '1px',
            backgroundColor: theme.palette.divider,
            transform: 'scaleX(100%)',
            transformOrigin: 'right',
        },
    },
    !active &&
        parent.layout === 'horizontal' && {
            ':hover': {
                ':after': {
                    backgroundColor: theme.palette.primary.main,
                    transform: 'scaleX(300%)',
                },
            },
        },
    active &&
        parent.layout === 'horizontal' && {
            ':after': {
                backgroundColor: theme.palette.primary.main,
                transform: 'scaleX(300%)',
            },
        },

    parent.layout !== 'horizontal' && {
        borderRight: '1px solid black',
        borderRightColor: theme.palette.divider,
        ':after': {
            top: 'auto',
            height: '1px',
            backgroundColor: theme.palette.divider,
            transform: 'scaleY(100%)',
            transformOrigin: 'bottom',
        },
    },
    !active &&
        parent.layout !== 'horizontal' && {
            ':hover': {
                ':after': {
                    backgroundColor: theme.palette.primary.main,
                    transform: 'scaleY(300%)',
                },
            },
        },
    active &&
        parent.layout !== 'horizontal' && {
            ':after': {
                backgroundColor: theme.palette.primary.main,
                transform: 'scaleY(300%)',
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

    let imageOrIcon = useMemo(() => {
        if (image) {
            return (
                <ListItemIcon>
                    <ImageIcon src={image} />
                </ListItemIcon>
            );
        } else if (icon) {
            return (
                <ListItemIcon key="icon">
                    <Icon>{icon}</Icon>
                </ListItemIcon>
            );
        }
    }, [image, icon]);

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
                primaryTypographyProps={useMemo(() => ({ noWrap: true }), [])}
                secondary={description}
                secondaryTypographyProps={useMemo(
                    () => ({
                        nowrap: true,
                        variant: 'caption',
                    }),
                    []
                )}
            />
        </Root>
    );
}
