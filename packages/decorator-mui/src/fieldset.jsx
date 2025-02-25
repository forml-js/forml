import {
    Box,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from '@mui/material';
import { useLocalizer } from '@forml/hooks';
import React, { useMemo } from 'react';

/**
 * @component
 */
function Root(props) {
    return <List flexDirection="column" flexGrow={1} {...props} />;
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
    const { disableMargin, ...forwardProps } = props;
    return (
        <Paper
            sx={{ flex: '1' }}
            margin={disableMargin ? 0 : 1}
            {...forwardProps}
        />
    );
}

function Title(props) {
    return <ListItem {...props} />;
}

export default function FieldSet(props) {
    const { form } = props;
    const localize = useLocalizer();

    const title = 'title' in form ? localize(form.title) : null;
    const description =
        'description' in form ? localize(form.description) : null;
    const alignItems = 'alignItems' in form ? form.alignItems : undefined;
    const layout = 'layout' in form ? form.layout : 'vertical';
    const showTitle = 'showTitle' in form ? form.showTitle : true;
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

    const titleComponent = (title || description) && showTitle && (
        <Title disablePadding={disablePadding} divider>
            {titleIcon}
            <ListItemText key="title" primary={title} secondary={description} />
        </Title>
    );

    const content = (
        <Root dense disablePadding>
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
    );

    if (title || description) {
        return <Surface elevation={elevation}>{content}</Surface>;
    } else {
        return content;
    }
}
