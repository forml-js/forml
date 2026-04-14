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
import React, { useMemo } from 'react';

/**
 * @component
 */
const RootList = styled(List)(() => ({ width: 'fill-available' }));
function Root(props) {
    return (
        <RootList dense disablePadding>
            {props.children}
        </RootList>
    );
}

const Content = styled(Box)(({ theme, disablePadding, layout, alignItems }) => [
    {
        display: 'grid',
        gap: theme.spacing(1),
        alignItems: alignItems,
    },
    layout === 'horizontal' && {
        gridAutoColumns: 'auto',
        gridAutoFlow: 'column,',
    },
    layout === 'vertical' && {
        gridAutoRows: 'auto',
        gridAutoFlow: 'row',
    },
    disablePadding && {
        padding: 0,
    },
    !disablePadding && {
        padding: theme.spacing(1),
    },
]);

function Title(props) {
    return <ListItem {...props} />;
}

export default function FieldSet(props) {
    const { form } = props;

    const title = 'title' in form ? form.title : null;
    const description = 'description' in form ? form.description : null;
    const alignItems = 'alignItems' in form ? form.alignItems : undefined;
    const layout = 'layout' in form ? form.layout : 'vertical';
    const showTitle =
        'showTitle' in form ? form.showTitle : Boolean(title || description);
    const disablePadding =
        'disablePadding' in form ? form.disablePadding : false;
    const Component = 'component' in form ? form.component : 'div';
    const elevation = 'elevation' in form ? form.elevation : 1;
    const icon = 'icon' in form ? form.icon : null;

    const titleIcon = icon ? (
        <ListItemIcon>
            <Icon key="icon">{icon}</Icon>
        </ListItemIcon>
    ) : null;

    const titleComponent = (title || description) && (
        <Title disablePadding={disablePadding} divider>
            {titleIcon}
            <ListItemText key="title" primary={title} secondary={description} />
        </Title>
    );

    const content = showTitle ? (
        <Root>
            {titleComponent}
            <Content
                layout={layout}
                component={Component}
                disablePadding={disablePadding}
                alignItems={alignItems}
            >
                {props.children}
            </Content>
        </Root>
    ) : (
        <Root>
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

    return content;
}
