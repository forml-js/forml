import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { RenderingContext, ModelContext } from '@forml/context';
import Pages from '../../../src/components/mapper/pages.jsx';

function MockPage({ children, activePage, index }) {
    if (index !== activePage) return null;
    return <div data-testid={`page-${index}`}>{children}</div>;
}

function MockPages({ form, active, children, setPage, className }) {
    return (
        <div data-testid="pages-container" className={className}>
            <button data-testid="back" onClick={() => setPage(active - 1)}>
                Back
            </button>
            <button data-testid="next" onClick={() => setPage(active + 1)}>
                Next
            </button>
            <div data-testid="pages-content">{children}</div>
        </div>
    );
}
MockPages.Page = MockPage;

const mockRenderingContext = {
    prefix: '',
    mapper: {},
    decorator: { pages: MockPages },
    localizer: (value) => value,
};

const mockModelContext = {
    model: {},
    keyMaps: {},
    schema: {},
};

function wrapper({ children }) {
    return (
        <RenderingContext.Provider value={mockRenderingContext}>
            <ModelContext.Provider value={mockModelContext}>
                {children}
            </ModelContext.Provider>
        </RenderingContext.Provider>
    );
}

describe('Pages Component', function () {
    let onChange;

    beforeEach(function () {
        onChange = vi.fn();
    });

    describe('renders', function () {
        it('the pages container', function () {
            const form = {
                type: 'pages',
                pages: [
                    { type: 'section', title: 'Page One' },
                    { type: 'section', title: 'Page Two' },
                ],
            };
            const { getByTestId } = render(
                <Pages form={form} onChange={onChange} />,
                {
                    wrapper,
                }
            );
            expect(getByTestId('pages-container')).to.exist;
        });

        it('the first page initially', function () {
            const form = {
                type: 'pages',
                pages: [
                    { type: 'section', title: 'Page One' },
                    { type: 'section', title: 'Page Two' },
                ],
            };
            const { getByTestId, queryByTestId } = render(
                <Pages form={form} onChange={onChange} />,
                { wrapper }
            );
            expect(getByTestId('page-0')).to.exist;
            expect(queryByTestId('page-1')).to.be.null;
        });

        it('passes htmlClass to the container', function () {
            const form = {
                type: 'pages',
                htmlClass: 'my-custom-class',
                pages: [{ type: 'section', title: 'Page One' }],
            };
            const { getByTestId } = render(
                <Pages form={form} onChange={onChange} />,
                {
                    wrapper,
                }
            );
            expect(getByTestId('pages-container').className).to.include(
                'my-custom-class'
            );
        });
    });

    describe('navigation', function () {
        it('advances to the next page', function () {
            const form = {
                type: 'pages',
                pages: [
                    { type: 'section', title: 'Page One' },
                    { type: 'section', title: 'Page Two' },
                ],
            };
            const { getByTestId, queryByTestId } = render(
                <Pages form={form} onChange={onChange} />,
                { wrapper }
            );
            fireEvent.click(getByTestId('next'));
            expect(queryByTestId('page-0')).to.be.null;
            expect(getByTestId('page-1')).to.exist;
        });

        it('goes back to the previous page', function () {
            const form = {
                type: 'pages',
                pages: [
                    { type: 'section', title: 'Page One' },
                    { type: 'section', title: 'Page Two' },
                ],
            };
            const { getByTestId, queryByTestId } = render(
                <Pages form={form} onChange={onChange} />,
                { wrapper }
            );
            fireEvent.click(getByTestId('next'));
            fireEvent.click(getByTestId('back'));
            expect(getByTestId('page-0')).to.exist;
            expect(queryByTestId('page-1')).to.be.null;
        });

        it('cannot go before page 0', function () {
            const form = {
                type: 'pages',
                pages: [
                    { type: 'section', title: 'Page One' },
                    { type: 'section', title: 'Page Two' },
                ],
            };
            const { getByTestId, queryByTestId } = render(
                <Pages form={form} onChange={onChange} />,
                { wrapper }
            );
            fireEvent.click(getByTestId('back'));
            expect(getByTestId('page-0')).to.exist;
            expect(queryByTestId('page-1')).to.be.null;
        });

        describe('without a completed form', function () {
            it('cannot advance past the last page', function () {
                const form = {
                    type: 'pages',
                    pages: [
                        { type: 'section', title: 'Page One' },
                        { type: 'section', title: 'Page Two' },
                    ],
                };
                const { getByTestId, queryByTestId } = render(
                    <Pages form={form} onChange={onChange} />,
                    { wrapper }
                );
                fireEvent.click(getByTestId('next'));
                fireEvent.click(getByTestId('next'));
                expect(queryByTestId('page-0')).to.be.null;
                expect(getByTestId('page-1')).to.exist;
            });
        });

        describe('with a completed form', function () {
            it('advances past the last page to the completed form', function () {
                const form = {
                    type: 'pages',
                    pages: [
                        { type: 'section', title: 'Page One' },
                        { type: 'section', title: 'Page Two' },
                    ],
                    completed: { type: 'section', title: 'Done' },
                };
                const { getByTestId, queryByTestId } = render(
                    <Pages form={form} onChange={onChange} />,
                    { wrapper }
                );
                fireEvent.click(getByTestId('next'));
                fireEvent.click(getByTestId('next'));
                expect(queryByTestId('page-0')).to.be.null;
                expect(queryByTestId('page-1')).to.be.null;
                expect(getByTestId(`page-${form.pages.length}`)).to.exist;
            });

            it('does not show the completed form before all pages are visited', function () {
                const form = {
                    type: 'pages',
                    pages: [
                        { type: 'section', title: 'Page One' },
                        { type: 'section', title: 'Page Two' },
                    ],
                    completed: { type: 'section', title: 'Done' },
                };
                const { getByTestId, queryByTestId } = render(
                    <Pages form={form} onChange={onChange} />,
                    { wrapper }
                );
                expect(getByTestId('page-0')).to.exist;
                expect(queryByTestId(`page-${form.pages.length}`)).to.be.null;
            });
        });
    });
});
