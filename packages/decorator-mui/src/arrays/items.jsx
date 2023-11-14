import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import React, { useMemo, forwardRef } from 'react';
import { useLocalizer } from '@forml/hooks';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper, {
    shouldForwardProp: (prop) =>
        !['disablePadding', 'disableGutters'].includes(prop),
})(({ theme, ...props }) => ({
    margin: theme.spacing?.(1),
    flex: '1 1 auto',
    ...(props.disablePadding
        ? {
              marginTop: 0,
              marginBottom: 0,
          }
        : {}),
    ...(props.disableGutters
        ? {
              marginLeft: 0,
              marginRight: 0,
          }
        : {}),
}));
const StyledList = forwardRef((props, ref) => (
    <List
        {...props}
        ref={ref}
        htmlname="items"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
        }}
    />
));

/**
 * @component
 */
function Items(props, ref) {
    const { title, form, otherProps } = props;
    const { error, description } = props;
    const { value, disabled } = props;

    const localizer = useLocalizer();
    const color = useMemo(() => (error ? 'error' : 'info'), [error]);

    const paperProps = useMemo(
        () => ({
            disablePadding:
                'disablePadding' in form ? form.disablePadding : false,
            disableGutters:
                'disableGutters' in form ? form.disableGutters : false,
        }),
        [form]
    );
    const icon = useMemo(
        () => (
            <ListItemIcon key="icon" edge="start">
                <Icon color={color}>
                    {'icon' in form ? form.icon : 'view_list'}
                </Icon>
            </ListItemIcon>
        ),
        [form]
    );
    const addText = useMemo(
        () =>
            'addText' in form
                ? localizer.getLocalizedString(form.addText)
                : title
                ? `${localizer.getLocalizedString('Add')} ${title}`
                : localizer.getLocalizedString('Add'),
        [form, localizer, title]
    );
    const suffix = useMemo(
        () =>
            value && value.length === 0 ? (
                <ListItem key="empty" divider>
                    <ListItemText
                        secondary={localizer.getLocalizedString('empty')}
                        secondaryTypographyProps={{ align: 'center' }}
                    />
                </ListItem>
            ) : null,
        [value, localizer]
    );

    return (
        <StyledPaper {...paperProps}>
            <StyledList disablePadding dense ref={ref} {...otherProps}>
                <ListItem key="title" dense={false} divider>
                    {icon}
                    <ListItemText
                        key="text"
                        primaryTypographyProps={{ color, variant: 'subtitle2' }}
                        primary={title}
                        secondary={error || description}
                    />
                    <Button
                        onClick={props.add}
                        color={color}
                        edge="end"
                        startIcon={<Icon>add</Icon>}
                        disabled={disabled}
                    >
                        {addText}
                    </Button>
                </ListItem>
                {props.children}
                {suffix}
            </StyledList>
        </StyledPaper>
    );
}
export default forwardRef(Items);
