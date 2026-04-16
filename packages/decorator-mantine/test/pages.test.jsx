import React from 'react';
import { MantineProvider } from '@mantine/core';
import { RenderingContext } from '@forml/context';
import { render, fireEvent, getByText } from '@testing-library/react';
import { Pages, Page } from '../src/pages.jsx';
import { withOptions } from '../src/index.jsx';

function makeWrapper({ decorator } = {}) {
    return ({ children }) => (
        <MantineProvider>
            <RenderingContext.Provider value={{ decorator }}>
                {children}
            </RenderingContext.Provider>
        </MantineProvider>
    );
}

describe('Page', function () {
    let wrapper;

    beforeEach(function () {
        wrapper = makeWrapper({ decorator: withOptions({ filled: false }) });
    });

    it('renders the page container', function () {
        const { container } = render(<Page>{[]}</Page>, { wrapper });

        const el = container.querySelector('.forml-pages-page');
        expect(el).to.exist;
    });

    it('renders children', function () {
        const { container } = render(
            <Page>
                <div className="page-child">content</div>
            </Page>,
            { wrapper }
        );

        const child = container.querySelector('.page-child');
        expect(child).to.exist;
        expect(child.textContent).to.equal('content');
    });
});

describe('Pages', function () {
    let form;
    let setPage;
    let wrapper;

    beforeEach(function () {
        form = {
            pages: [{ title: 'Step One' }, { title: 'Step Two' }],
            backText: 'Back',
            nextText: 'Next',
        };
        setPage = vi.fn();
        wrapper = makeWrapper({ decorator: withOptions({ filled: false }) });
    });

    describe('container', function () {
        it('renders the pages root', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            const el = container.querySelector('.forml-pages');
            expect(el).to.exist;
        });

        it('sets data-collapse to false by default', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            const el = container.querySelector('.forml-pages');
            expect(el.getAttribute('data-collapse')).to.equal('false');
        });

        it('sets data-collapse from form.collapse', function () {
            form = { ...form, collapse: true };
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            const el = container.querySelector('.forml-pages');
            expect(el.getAttribute('data-collapse')).to.equal('true');
        });
    });

    describe('header', function () {
        it('renders when title is present', function () {
            form = { ...form, title: 'My Form' };
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            const header = container.querySelector('.forml-header');
            expect(header).to.exist;
        });

        it('renders the title', function () {
            form = { ...form, title: 'My Form' };
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            expect(getByText(container, form.title)).to.exist;
        });

        it('renders when description is present', function () {
            form = { ...form, description: 'A description' };
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            const header = container.querySelector('.forml-header');
            expect(header).to.exist;
        });

        it('renders the description', function () {
            form = { ...form, description: 'A description' };
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            expect(getByText(container, form.description)).to.exist;
        });

        it('does not render when no title or description', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            const header = container.querySelector('.forml-header');
            expect(header).to.not.exist;
        });
    });

    describe('stepper', function () {
        it('renders a step for each page', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    <div />
                    <div />
                </Pages>,
                { wrapper }
            );

            const steps = container.querySelectorAll('.mantine-Stepper-step');
            expect(steps.length).to.equal(form.pages.length);
        });

        it('renders the step labels', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    <div />
                    <div />
                </Pages>,
                { wrapper }
            );

            expect(getByText(container, 'Step One')).to.exist;
            expect(getByText(container, 'Step Two')).to.exist;
        });

        describe('skipping', function () {
            it('calls setPage when a step is clicked and skipping is enabled', function () {
                form = { ...form, skipping: true };
                const { container } = render(
                    <Pages form={form} active={0} setPage={setPage}>
                        <div />
                        <div />
                    </Pages>,
                    { wrapper }
                );

                const stepButton = container.querySelectorAll(
                    '.mantine-Stepper-step'
                )[1];
                fireEvent.click(stepButton);
                expect(setPage).to.have.been.called;
            });

            it('does not call setPage on step click when skipping is disabled', function () {
                const { container } = render(
                    <Pages form={form} active={0} setPage={setPage}>
                        <div />
                        <div />
                    </Pages>,
                    { wrapper }
                );

                const stepButton = container.querySelectorAll(
                    '.mantine-Stepper-step'
                )[1];
                fireEvent.click(stepButton);
                expect(setPage).not.to.have.been.called;
            });
        });
    });

    describe('progress', function () {
        it('renders the back button text', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            expect(getByText(container, form.backText)).to.exist;
        });

        it('renders the next button text', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            expect(getByText(container, form.nextText)).to.exist;
        });

        it('calls setPage with active - 1 when back is clicked', function () {
            const { container } = render(
                <Pages form={form} active={1} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            fireEvent.click(getByText(container, form.backText));
            expect(setPage).to.have.been.calledOnce;
            expect(setPage).to.have.been.calledWith(0);
        });

        it('calls setPage with active + 1 when next is clicked', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            fireEvent.click(getByText(container, form.nextText));
            expect(setPage).to.have.been.calledOnce;
            expect(setPage).to.have.been.calledWith(1);
        });
    });

    describe('with filled option', function () {
        beforeEach(function () {
            wrapper = makeWrapper({ decorator: withOptions({ filled: true }) });
        });

        it('sets data-filled on the container', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            const el = container.querySelector('.forml-pages');
            expect(el.getAttribute('data-filled')).to.equal('true');
        });
    });

    describe('without filled option', function () {
        it('sets data-filled to false on the container', function () {
            const { container } = render(
                <Pages form={form} active={0} setPage={setPage}>
                    {[]}
                </Pages>,
                { wrapper }
            );

            const el = container.querySelector('.forml-pages');
            expect(el.getAttribute('data-filled')).to.equal('false');
        });
    });
});
