import clsx from 'clsx';
import { useCallback, useMemo } from 'react';

export function Page(props) {
    const { children, activePage, index } = props;
    if (index !== activePage) return null;
    return <div className="pages-page">{children}</div>;
}

function Divider(_props) {
    return <div className="pages-divider" />;
}

function Steps(props) {
    const { form, active, setPage } = props;
    const steps = useMemo(() => {
        const steps = form.pages.map((step, index) => (
            <Step
                form={form}
                active={active}
                index={index}
                step={step}
                setPage={setPage}
            />
        ));
        const children = [];
        for (let index = 0; index < steps.length; index++) {
            children.push(steps[index]);
            if (index < steps.length - 1) {
                children.push(<Divider />);
            }
        }
        return children;
    }, [form, setPage, active]);
    return <div className="pages-steps">{steps}</div>;
}
function Step(props) {
    const { form, step, index, setPage } = props;
    const skipping = 'skipping' in form ? form.skipping : false;
    const onClick = skipping ? () => setPage(index) : null;
    return (
        <div className="pages-step">
            <span
                className="pages-step-label"
                data-clickable={!skipping}
                onClick={onClick}
            >
                {step.title}
            </span>
        </div>
    );
}
function Progress(props) {
    const { active, form, setPage } = props;
    const goBack = useCallback(() => setPage(active - 1), [setPage, active]);
    const goNext = useCallback(() => setPage(active + 1), [setPage, active]);
    return (
        <div className="pages-progress">
            <button onClick={goBack}>{form.backText}</button>
            <button onClick={goNext}>{form.nextText}</button>
        </div>
    );
}
export function Pages(props) {
    const { form, active, children, setPage } = props;
    const className = clsx('pages-container', props.className);
    return (
        <div className={className} data-collapse={form.collapse ?? false}>
            <Steps active={active} form={form} setPage={setPage} />
            {children}
            <Progress form={form} active={active} setPage={setPage} />
        </div>
    );
}

Pages.Page = Page;
export default Pages;
