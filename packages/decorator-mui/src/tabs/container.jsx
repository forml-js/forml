import {
    Box,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    styled,
} from '@mui/material';
import React, { useMemo, useRef } from 'react';

const Root = styled(Paper)(({ form }) => [
    {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    form.disableMargin && { m: 0 },
]);
const Content = styled(Box)(({ form, orientation }) => [
    {
        position: 'relative',
        flexGrow: 1,
        flexDirection: 'column',
    },
    orientation === 'horizontal' && { display: 'grid' },
    orientation === 'vertical' && { display: 'flex' },
    form.disableMargin && { margin: 0 },
    form.disablePadding && { padding: 0 },
]);

const Tabs = styled(Paper)(({ theme, form }) => [
    {
        display: 'flex',
        flexGrow: 1,
        gridArea: '1 / -1',
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
            position: 'relative',
            overflow: 'hidden',
            maxWidth: theme.spacing(7),
            width: 'fit-content',
            transition: 'all 0.3s',
            ':hover': {
                maxWidth: '100%',
            },
        },
]);
const TabList = styled(List)(({ form }) => [
    {
        display: 'flex',
        flexGrow: 1,
        maxWidth: 'fill-available',
    },
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
        gridArea: '1 / -1',
        transition: theme.transitions.create(),
    },
    form.layout === 'horizontal' && {
        flexDirection: 'column',
        flexGrow: 1,
    },
    !form.disableMargin && {
        margin: theme.spacing(0, 1),
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
    { flex: 0 },
    form?.layout !== 'horizontal' && {
        borderRight: '1px solid black',
        borderRightColor: theme.palette.divider,
    },
]);

function Title(props) {
    const { form } = props;

    const showTitle = 'showTitle' in form ? form.showTitle : true;
    const icon = 'icon' in form ? form.icon : 'view_carousel';
    const title = 'title' in form ? form.title : null;
    const description = 'description' in form ? form.description : null;

    if (!showTitle || (!title && !description)) {
        return null;
    }

    return (
        <TitleList form={form} dense disablePadding>
            <TitleListItem form={form} divider>
                {icon && (
                    <ListItemIcon key="icon">
                        <Icon fontSize="small">{icon}</Icon>
                    </ListItemIcon>
                )}
                <ListItemText
                    key="title"
                    primary={title}
                    secondary={description}
                />
            </TitleListItem>
        </TitleList>
    );
}

/**
 * @component
 */
export default function Container(props) {
    const { form } = props;
    const ref = useRef(null);

    const orientation = 'layout' in form ? form.layout : 'vertical';

    return (
        <Root form={form}>
            <Title form={form} />
            <Content
                tabs={props.tabs.length}
                form={form}
                orientation={orientation}
            >
                <Tabs form={form} square elevation={0} ref={ref}>
                    <TabList form={form} dense disablePadding>
                        {props.tabs}
                    </TabList>
                </Tabs>
                <Panels form={form}>{props.panels}</Panels>
            </Content>
        </Root>
    );
}
