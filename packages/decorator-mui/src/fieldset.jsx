import { Box, Icon, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import React, { useMemo } from 'react';

/**
 * @component
 */
function Root(props) {
    return <List flexDirection="column" flexGrow={1} {...props} />
}

function Content(props) {
    const { disablePadding, layout, alignItems, ...forwardProps } = props;
    const gridLayout = useMemo(() => {
        if (layout === 'horizontal') {
            return { gridAutoColumns: '1fr', gridAutoFlow: 'column' };
        } else {
            return { gridAutoRows: '1fr', gridAutoFlow: 'row' };
        }
    }, [layout])
    return (
        <Box
            display="grid"
            p={disablePadding ? 0 : 1}
            g={1}
            alignItems={alignItems}
            {...gridLayout}
            {...forwardProps}
        />
    );
}

function Surface(props) {
    const { disableMargin, ...forwardProps } = props;
    return <Paper margin={disableMargin ? 0 : 1} {...forwardProps} />;
}

function Title(props) {
    return <ListItem {...props} />;
}

export default function FieldSet(props) {
    const { title, description, form } = props;

    const settings = useMemo(
        () => ({
            alignItems: 'alignItems' in form ? form.alignItems : undefined,
            layout: 'layout' in form ? form.layout : 'vertical',
            showTitle: 'showTitle' in form ? form.showTitle : true,
            disablePadding:
                'disablePadding' in form ? form.disablePadding : false,
            Component: 'component' in form ? form.component : 'div',
            elevation: 'elevation' in form ? form.elevation : 1,
            icon: 'icon' in form ? form.icon : null,
        }),
        [form]
    );
    const titleIcon = useMemo(
        () =>
            settings.icon ? (
                <ListItemIcon>
                    <Icon key="icon">{settings.icon}</Icon>
                </ListItemIcon>
            ) : null,
        [settings.icon]
    );
    const titleComponent = useMemo(() => {
        (title || description) && settings.showTitle && (
            <Title disablePadding={settings.disablePadding} divider>
                {titleIcon}
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
        );
    }, [title, titleIcon, description, settings]);

    const content = useMemo(
        () => (
            <Root dense disablePadding>
                {titleComponent}
                <Content
                    layout={settings.layout}
                    component={settings.Component}
                    disablePadding={settings.disablePadding}
                    alignItems={settings.alignItems}
                >
                    {props.children}
                </Content>
            </Root>
        ),
        [titleComponent, settings, props.children]
    );

    return useMemo(() => {
        if (title || description) {
            return <Surface elevation={settings.elevation}>{content}</Surface>;
        } else {
            return content;
        }
    }, [title, description, content]);
}
