import {
    Box,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from '@mui/material';
import React, { useMemo } from 'react';

/**
 * @component
 */
function Root(props) {
    return (
        <List sx={{ width: 'fill-available' }} dense disablePadding>
            {props.children}
        </List>
    );
}

function Content(props) {
    const { disablePadding, layout, alignItems, ...forwardProps } = props;
    const gridLayout = useMemo(() => {
        if (layout === 'horizontal') {
            return { gridAutoColumns: 'auto', gridAutoFlow: 'column' };
        } else {
            return { gridAutoRows: 'auto', gridAutoFlow: 'row' };
        }
    }, [layout]);
    return (
        <Box
            display="grid"
            padding={disablePadding ? 0 : 1}
            gap={1}
            alignItems={alignItems}
            {...gridLayout}
            {...forwardProps}
        />
    );
}

function Surface(props) {
    const { disableMargin, children } = props;
    return (
        <Paper sx={{ flex: '1' }} margin={disableMargin ? 0 : 1}>
            {children}
        </Paper>
    );
}

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
