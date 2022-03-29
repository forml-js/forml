import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import React from 'react';

/**
 * @component
 */
const Root = styled(List)(({ theme, disablePadding }) => [
    {
        flexDirection: 'column',
        flexGrow: 1,
    },
]);
const Content = styled(Box)(({ theme, disablePadding, layout, alignItems }) => [
    {
        display: 'flex',
        flexDirection: layout === 'vertical' ? 'column' : 'row',
        padding: theme.spacing(1),
        gap: theme.spacing(1),
        alignItems: alignItems,
    },
    disablePadding && {
        padding: 0,
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
const Title = styled(ListItem)(({ theme }) => ({}));

export default function FieldSet(props) {
    const { title, description, form } = props;

    const alignItems = 'alignItems' in form ? form.alignItems : undefined;
    const layout = 'layout' in form ? form.layout : 'vertical';
    const showTitle = 'showTitle' in form ? form.showTitle : true;
    const disablePadding =
        'disablePadding' in form ? form.disablePadding : false;
    const Component = 'component' in form ? form.component : 'div';
    const elevation = 'elevation' in form ? form.elevation : 1;
    const icon = 'icon' in form ? form.icon : null;

    let content = (
        <Root dense disablePadding>
            {(title || description) && showTitle && (
                <Title disablePadding={disablePadding} divider>
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
                </Title>
            )}
            <Content
                layout={layout}
                component={Component}
                disablePadding={disablePadding}
                alignItems={alignItems}
            >
                {props.children}
            </Content>
        </Root>
    );

    if (title || description) {
        content = <Surface elevation={elevation}>{content}</Surface>;
    }

    return content;
}
