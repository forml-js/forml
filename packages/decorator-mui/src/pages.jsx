import {
    Paper,
    Button,
    Box,
    Step,
    Stepper,
    StepButton,
    StepLabel,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Icon,
    styled,
} from '@mui/material';
import { useCallback, useMemo } from 'react';

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
const Root = styled(Paper)(({ form, theme }) => [
    form.disableMargin ? { m: 0 } : { m: 1 },
    form.collapse ? { margin: '0 auto', justifySelf: 'center' } : {},
    { display: 'flex', flexDirection: 'column' },
    {
        '& .MuiStepConnector-root': {
            minWidth: theme.spacing(3),
        },
    },
]);
const Steps = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 min-content',
    margin: `${theme.spacing(1)} ${theme.spacing(1)} 0`,
}));
const Content = ({ form, orientation, ...props }) => (
    <Box
        {...props}
        sx={useMemo(
            () => ({
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 auto',
                m: form.disableMargin ? 0 : 1,
                p: form.disablePadding ? 0 : 1,
            }),
            [form.disableMargin, form.disablePadding]
        )}
    />
);

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

const StyledPaper = styled(Paper)((props) => ({
    display: 'flex',
    flexDirection: 'row',
    transition: 'all 0.3s',
    flex: '1 1 100%',
    height: '100%',
    p: 1,
    width: 'fill-available',
}));

function Progress(props) {
    const { setPage, activePage, form } = props;
    const goBack = useCallback(
        () => setPage(activePage - 1),
        [setPage, activePage]
    );
    const goNext = useCallback(
        () => setPage(activePage + 1),
        [setPage, activePage]
    );
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 1,
                padding: 1,
                paddingTop: 0,
            }}
        >
            <Button variant="contained" onClick={goBack}>
                {form.backText}
            </Button>
            <Button variant="contained" onClick={goNext}>
                {form.nextText}
            </Button>
        </Box>
    );
}

export function Page(props) {
    const { children, activePage, index } = props;
    if (activePage !== index) return null;
    return <StyledPaper>{children}</StyledPaper>;
}

export function Pages(props) {
    const { form, active, setPage, children } = props;
    const steps = form.pages.map((step, index) => {
        const skipping = 'skipping' in form ? form.skipping : false;
        const label = <StepLabel>{step.title}</StepLabel>;
        return (
            <Step key={step.title} icon={step.icon}>
                {skipping ? (
                    <StepButton onClick={() => setPage(index)}>
                        {label}
                    </StepButton>
                ) : (
                    label
                )}
            </Step>
        );
    });

    return (
        <Root form={form}>
            <Title form={form} />
            <Steps>
                <Stepper nonLinear activeStep={active}>
                    {steps}
                </Stepper>
            </Steps>
            <Content form={form}>{children}</Content>
            <Progress setPage={setPage} activePage={active} form={form} />
        </Root>
    );
}

Pages.Page = Page;
export default Pages;
