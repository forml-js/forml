import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import styled from '@mui/material/styles/styled';
import Paper from '@mui/material/Paper';
import React from 'react';

const Root = styled(Paper)(({ form }) => [
    {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    form.disableMargin && { m: 0 },
]);
const Content = styled(Box)(({ theme, tabs, form }) => [
    {
        position: 'relative',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        minHeight: theme.spacing(tabs * 7 + 1 + tabs / 8),
    },
    form.disableMargin && { m: 0 },
    form.disablePadding && { p: 0 },
]);
const Tabs = styled(Paper)(({ theme, form }) => [
    {
        display: 'flex',
        flexGrow: 1,
        top: 0,
        left: 0,
        display: 'flex',
        flex: '0 0 auto',
        zIndex: 10,
        alignItems: 'flex-start',
        whiteSpace: 'nowrap',
    },
    form?.layout !== 'horizontal' && {
        right: 0,
        bottom: 'auto',
        borderBottom: '1px solid black',
        borderBottomColor: theme.palette.divider,
    },
    form?.layout === 'horizontal' && {
        bottom: 0,
        right: 'auto',
        borderRight: '1px solid black',
        borderRightColor: theme.palette.divider,
    },
    form?.collapse &&
        form.layout === 'horizontal' && {
            position: 'absolute',
            overflow: 'hidden',
            maxWidth: theme.spacing(7),
            transition: 'all 0.3s',
            ':hover': {
                maxWidth: '100%',
            },
        },
]);
const TabList = styled(List)(({ form }) => [
    { display: 'flex', flexGrow: 1, maxWidth: 'fill-available' },
    form.layout !== 'horizontal' && {
        flexDirection: 'row',
    },
    form.layout === 'horizontal' && {
        flexDirection: 'column',
    },
]);
const Panels = styled(Box)(({ form, theme }) => [
    {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 5,
    },
    !form.disableMargin && {
        margin: theme.spacing(1),
    },
    form.layout === 'horizontal' &&
        form.collapse && {
            marginLeft: theme.spacing(7),
        },
]);
const TitleList = styled(List)(() => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
}));
const TitleListItem = styled(ListItem)(({ theme, form }) => [
    { flex: '0 0 0' },
    form?.layout !== 'horizontal' && {
        borderRight: '1px solid black',
        borderRightColor: theme.palette.divider,
    },
]);

/**
 * @component
 */
export default function Container(props) {
    const { title, description, form, collapse } = props;

    const icon = form.icon ?? 'view_carousel';
    const showTitle = form.showTitle ?? true;

    return (
        <Root form={form}>
            {(title || description) && showTitle && (
                <TitleList form={form} dense disablePadding>
                    <TitleListItem form={form} divider>
                        {icon && (
                            <ListItemIcon key="icon">
                                <Icon fontSize="small">{icon}</Icon>
                            </ListItemIcon>
                        )}
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
                    </TitleListItem>
                </TitleList>
            )}
            <Content collapse={collapse} tabs={props.tabs.length} form={form}>
                <Tabs collapse={collapse} form={form} square elevation={0}>
                    <TabList
                        collapse={collapse}
                        form={form}
                        dense
                        disablePadding
                    >
                        {props.tabs}
                    </TabList>
                </Tabs>
                <Panels collapse={collapse} form={form}>
                    {props.panels}
                </Panels>
            </Content>
        </Root>
    );
}
