import 'material-icons/iconfont/material-icons.css';
import React, { useMemo, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CssBaseline,
    GlobalStyles,
    Box,
    Icon,
    CircularProgress,
    Divider as MuiDivider,
    Typography,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function Title(props) {
    if (props.children?.length > 0) {
        return <Header>{props.children}</Header>;
    } else {
        return null;
    }
}

export const Progress = CircularProgress;
export const Divider = () => <MuiDivider orientation="vertical" />;

export function Dashboard(props) {
    return (
        <Box
            display="grid"
            gridAutoFlow="column"
            gridAutoColumns="1fr min-content 3fr"
            height="fill-available"
            maxHeight="fill-available"
            overflow="hidden"
        >
            {props.children}
        </Box>
    );
}

export function Panel(props) {
    const panelSx = useMemo(
        () => ({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'stretch',
            overflow: 'hidden',
        }),
        []
    );
    return <Box sx={panelSx}>{props.children}</Box>;
}

export function Collapse(props) {
    const [expanded, setExpanded] = useState(props.defaultExpanded);
    const subPanelSx = useMemo(
        () => ({
            display: 'flex',
            flexDirection: 'column',
            height: 'fill-available',
            overflow: 'hidden',
        }),
        []
    );
    const children = useMemo(
        () =>
            props.children.map((child) => (
                <CollapseSection
                    key={child.props.title}
                    expanded={expanded === child.props.title}
                    onChange={() => setExpanded(child.props.title)}
                    title={child.props.title}
                >
                    {child}
                </CollapseSection>
            )),
        [props.children, expanded]
    );
    return <Box sx={subPanelSx}>{children}</Box>;
}
Panel.Collapse = Collapse;

function Section(props) {
    const panelSectionSx = useMemo(
        () => ({
            display: 'grid',
            gridAutoRows: 'min-content auto',
        }),
        []
    );
    const panelSectionTitleSx = useMemo(
        () => ({
            textAlign: 'center',
            backgroundColor: 'primary.dark',
            color: 'primary.contrastText',
            padding: 1,
        }),
        []
    );
    const panelSectionContentSx = useMemo(
        () => ({
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            overflow: 'auto',
        }),
        []
    );
    return (
        <Box sx={panelSectionSx}>
            <Box sx={panelSectionTitleSx} key="title">
                <Typography variant="subtitle2">{props.title}</Typography>
            </Box>
            <Box
                key="content"
                sx={panelSectionContentSx}
                p={props.padded ? 1 : 0}
                gap={props.padded ? 1 : 0}
            >
                {props.children}
            </Box>
        </Box>
    );
}
Panel.Section = Section;

function CollapseSection(props) {
    const { expanded } = props;
    const accordionSx = useMemo(
        () => ({
            display: 'flex',
            flexDirection: 'column',
            flex: expanded ? '1 1 fill-available' : '0 0 0',
            height: expanded ? 'fill-available' : 'min-content',
            '& .MuiCollapse-root': {
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
            },
            '& .MuiCollapse-wrapper': {
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
            },
            '& .MuiCollapse-wrapperInner': {
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
            },
            '& .MuiAccordion-region': {
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                maxHeight: expanded ? '100%' : '0%',
                transition: (theme) => theme.transitions.create('max-height'),
            },
            '& .MuiAccordionDetails-root': {
                height: expanded ? '100%' : '0%',
                maxHeight: 'fill-available',
                transition: (theme) => theme.transitions.create('height'),
            },
        }),
        [expanded]
    );
    return (
        <Accordion
            disableGutters
            slotProps={{ transition: { unmountOnExit: true } }}
            expanded={expanded}
            square
            sx={accordionSx}
        >
            <AccordionSummary
                key="summary"
                sx={{
                    flex: '0 0 auto',
                    bgcolor: 'primary.dark',
                    color: 'primary.contrastText',
                }}
                expandIcon={<Icon>expand_more</Icon>}
                onClick={props.onChange}
            >
                {props.title}
            </AccordionSummary>
            <AccordionDetails
                key="details"
                sx={{ flex: '1 1 auto', padding: 0 }}
            >
                {props.children}
            </AccordionDetails>
        </Accordion>
    );
}
Panel.CollapseSection = CollapseSection;

export function Header(props) {
    return (
        <Box
            p={1}
            bgcolor="primary.dark"
            color="primary.contrastText"
            textAlign="center"
        >
            <Typography variant="subtitle2">{props.children}</Typography>
        </Box>
    );
}

export function Canvas(props) {
    const { title } = props;
    return (
        <Box
            display="grid"
            gridAutoFlow="row"
            height="fill-available"
            gridAutoRows="min-content 1fr"
            overflow="auto"
            key="primary-viewport"
        >
            <Title key="title">{title}</Title>
            <Box key="content" sx={{ padding: title ? 1 : 0 }}>
                {props.children}
            </Box>
        </Box>
    );
}

const globalStyles = {
    html: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    '#app': {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        maxHeight: 'fill-available',
        maxWidth: 'fill-available',
        overflow: 'hidden',
    },
};
const theme = createTheme({
    colorSchemes: {
        dark: {
            palette: {
                primary: {
                    main: '#444a63',
                },
                secondary: {
                    main: '#596181',
                },
            },
        },
        light: {
            palette: {
                primary: {
                    main: '#444a63',
                },
                secondary: {
                    main: '#596181',
                },
            },
        },
    },
});
export function Provider(props) {
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CssBaseline />
                <GlobalStyles styles={globalStyles} />
                {props.children}
            </LocalizationProvider>
        </ThemeProvider>
    );
}
