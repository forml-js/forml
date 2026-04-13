import { Button, Box, Paper, Divider, Text, Title } from '@mantine/core';
import { Stepper } from '@mantine/core';
import React, { Children, useCallback } from 'react';
import { useDecorator } from '@forml/hooks';
import { SchemaField } from '@forml/core';
import './pages.css';
import clsx from 'clsx';

export function Page(props) {
    const { children } = props;
    return <Box className="forml-pages-page">{children}</Box>;
}

function Header(props) {
    const { title, description } = props;
    const options = useDecorator('options');
    if (title || description) {
        return (
            <Box className="forml-header" data-filled={options.filled}>
                <Box className="forml-header-text">
                    {title && <Title order={6}>{title}</Title>}
                    {description && <Text size="xs">{description}</Text>}
                </Box>
            </Box>
        );
    } else {
        return null;
    }
}

function Base({ className, ...props }) {
    const options = useDecorator('options');
    className = clsx('forml-pages', className);
    return (
        <Paper {...props} className={className} data-filled={options.filled}>
            {props.children}
        </Paper>
    );
}

function Progress(props) {
    const { nextText, backText, setPage, index } = props;
    const goNext = useCallback(() => setPage(index + 1), [setPage, index]);
    const goBack = useCallback(() => setPage(index - 1), [setPage, index]);
    return (
        <Box className="forml-pages-progress">
            <Button onClick={goBack}>{backText}</Button>
            <Button onClick={goNext}>{nextText}</Button>
        </Box>
    );
}

export function Pages(props) {
    const { form, active, className, setPage } = props;
    const steps = form.pages;
    const collapse = 'collapse' in form ? form.collapse : false;
    const children = Children.map(props.children, (child, index) => {
        const step = steps[index];
        return (
            <Stepper.Step label={step.title} icon={step.icon}>
                {child}
            </Stepper.Step>
        );
    });
    return (
        <Base className={className} data-collapse={collapse}>
            <Header title={form.title} description={form.description} />
            <Divider />
            <Box className="forml-content">
                <Stepper
                    active={active}
                    onStepClick={form.skipping ? setPage : null}
                    wrap={false}
                    contentPadding="xs"
                    size="xs"
                >
                    {children}
                </Stepper>
                <Progress
                    nextText={form.nextText}
                    backText={form.backText}
                    index={active}
                    setPage={setPage}
                />
            </Box>
        </Base>
    );
}

Pages.Page = Page;
export default Pages;
