import { generateColors } from '@mantine/colors-generator';
import {
    Accordion,
    Box,
    Divider as MantineDivider,
    MantineProvider,
    RingProgress,
    Text,
    createTheme,
} from '@mantine/core';
import React, { useCallback, useMemo, useState } from 'react';
import './style.css';

export const Progress = RingProgress;

export function Divider(props) {
    return <MantineDivider orientation="vertical" />;
}

export function Dashboard(props) {
    return <Box className="forml-dashboard">{props.children}</Box>;
}

export function Panel(props) {
    return <Box className="forml-panel">{props.children}</Box>;
}

export function Collapse(props) {
    const [expanded, setExpanded] = useState(props.defaultExpanded);
    const onChange = useCallback(
        (value) => {
            if (value !== null) {
                setExpanded(value);
            }
        },
        [setExpanded]
    );
    const children = useMemo(
        () =>
            props.children.map((child) => (
                <Accordion.Item
                    className="forml-collapse-item"
                    key={child.props.title}
                    value={child.props.title}
                    transitionDuration={300}
                >
                    <Accordion.Control className="forml-collapse-control">
                        {child.props.title}
                    </Accordion.Control>
                    <Accordion.Panel className="forml-collapse-panel">
                        {child}
                    </Accordion.Panel>
                </Accordion.Item>
            )),
        [props.children]
    );
    return (
        <Accordion
            value={expanded}
            onChange={onChange}
            multiple={false}
            className="forml-collapse"
        >
            {children}
        </Accordion>
    );
}
Panel.Collapse = Collapse;

function Section(props) {
    const className = props.maxi ? 'forml-section-maxi' : 'forml-section-mini';
    const title = props.title;
    let content = props.children;
    if (title) {
        content = (
            <>
                <Header key="header">{title}</Header>
                <Box className="forml-section-content" key="content">
                    {content}
                </Box>
            </>
        );
    }
    return <Box className={className}>{content}</Box>;
}
Panel.Section = Section;

export function Header(props) {
    return (
        <Box className="forml-section-header">
            <Text size="sm" fw="bold">
                {props.children}
            </Text>
        </Box>
    );
}

export function Canvas(props) {
    const { title } = props;
    return (
        <Box className="forml-canvas">
            {title && <Header key="title">{title}</Header>}
            <Box
                key="content"
                p={title ? 'md' : false}
                className="forml-canvas-content"
            >
                {props.children}
            </Box>
        </Box>
    );
}

const theme = createTheme({
    colors: {
        forml: generateColors('#444a63'),
    },
    primaryColor: 'forml',
    primaryShade: 9,
});
export function Provider(props) {
    return (
        <MantineProvider theme={theme} defaultColorScheme="auto">
            {props.children}
        </MantineProvider>
    );
}
