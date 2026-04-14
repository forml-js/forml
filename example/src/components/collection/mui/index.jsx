import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    CircularProgress,
    CssBaseline,
    FormControlLabel,
    FormGroup,
    GlobalStyles,
    Icon,
    Divider as MuiDivider,
    Switch,
    ThemeProvider,
    Typography,
    createTheme,
    styled,
    useColorScheme,
    useMediaQuery,
} from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'material-icons/iconfont/material-icons.css';
import { useCallback, useMemo, useState } from 'react';

function Title(props) {
    if (props.children?.length > 0) {
        return <Header>{props.children}</Header>;
    } else {
        return null;
    }
}

export const Progress = CircularProgress;
export const Divider = () => <MuiDivider orientation="vertical" />;
export function useMode() {
    const { mode } = useColorScheme();
    return mode;
}
export function useModeSwitcher() {
    const { mode, setMode } = useColorScheme();
    return useCallback(
        () => (mode === 'light' ? setMode('dark') : setMode('light')),
        [mode, setMode]
    );
}

export const Dashboard = styled(Box)(() => ({
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr min-content 3fr',
    height: 'fill-available',
    maxHeight: 'fill-available',
    overflow: 'hidden',
}));

export const Panel = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    overflow: 'hidden',
}));

export const SubPanel = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    height: 'fill-available',
    overflow: 'hidden',
}));

export function Collapse(props) {
    const [expanded, setExpanded] = useState(props.defaultExpanded);
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
    return <SubPanel>{children}</SubPanel>;
}
Panel.Collapse = Collapse;

const PanelSection = styled(Box)(() => ({
    display: 'grid',
    gridAutoRows: 'min-content auto',
}));
const PanelSectionTitle = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    bgcolor: theme.palette.primary[theme.palette.mode],
    color: 'primary.contrastText',
    padding: 1,
}));
const PanelSectionContent = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflow: 'auto',
}));
function Section(props) {
    return (
        <PanelSection>
            <PanelSectionTitle key="title">
                <Typography variant="subtitle2">{props.title}</Typography>
            </PanelSectionTitle>
            <PanelSectionContent
                key="content"
                p={props.padded ? 1 : 0}
                gap={props.padded ? 1 : 0}
            >
                {props.children}
            </PanelSectionContent>
        </PanelSection>
    );
}
Panel.Section = Section;

const StyledAccordion = styled(Accordion)(({ expanded, theme }) => ({
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
        transition: theme.transitions.create('max-height'),
    },
    '& .MuiAccordionDetails-root': {
        height: expanded ? '100%' : '0%',
        maxHeight: 'fill-available',
        transition: theme.transitions.create('height'),
    },
}));
const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    flex: '0 0 auto',
    bgcolor: theme.palette.primary[theme.palette.mode],
    color: 'primary.contrastText',
}));
const StyledAccordionDetails = styled(AccordionDetails)(() => ({
    flex: '1 1 auto',
    padding: 0,
}));

function CollapseSection(props) {
    const { expanded } = props;
    const { mode } = useColorScheme();
    return (
        <StyledAccordion
            disableGutters
            slotProps={{ transition: { unmountOnExit: false } }}
            expanded={expanded}
            square
        >
            <StyledAccordionSummary
                key="summary"
                expandIcon={<Icon>expand_more</Icon>}
                onClick={props.onChange}
            >
                {props.title}
            </StyledAccordionSummary>
            <StyledAccordionDetails key="details">
                {props.children}
            </StyledAccordionDetails>
        </StyledAccordion>
    );
}
Panel.CollapseSection = CollapseSection;

const HeaderBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary[theme.palette.mode],
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
}));
export function Header(props) {
    const { mode } = useColorScheme();
    return (
        <HeaderBox
            p={1}
            bgcolor={`primary.${mode}`}
            color="primary.contrastText"
            textAlign="center"
        >
            <Typography variant="subtitle2">{props.children}</Typography>
        </HeaderBox>
    );
}

const CanvasBox = styled(Box)(() => ({
    display: 'grid',
    gridAutoFlow: 'row',
    height: 'fill-available',
    gridAutoRows: 'min-content 1fr',
    overflow: 'auto',
}));
const CanvasContent = styled(Box)(({ pad, theme }) => ({
    padding: pad ? theme.spacing(1) : 0,
}));
export function Canvas(props) {
    const { title } = props;
    return (
        <CanvasBox key="primary-viewport">
            <Title key="title">{title}</Title>
            <CanvasContent key="content" pad={!!title}>
                {props.children}
            </CanvasContent>
        </CanvasBox>
    );
}

export function Toggle(props) {
    const { title, value, onChange } = props;
    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Switch checked={value} title={title} onChange={onChange} />
                }
                label={title}
            />
        </FormGroup>
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
export function Provider(props) {
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(() =>
        createTheme({
            defaultColorScheme: prefersDark ? 'dark' : 'light',
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
        })
    );
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
