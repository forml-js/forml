import React from 'react';
import { MantineProvider } from '@mantine/core';
import { render, getByText } from '@testing-library/react';
import Help from '../src/help.jsx';

function wrapper({ children }) {
    return <MantineProvider>{children}</MantineProvider>;
}

describe('Help', function () {
    let form;

    beforeEach(function () {
        form = { description: 'Some helpful text' };
    });

    it('renders the description', function () {
        const { container } = render(<Help form={form} />, { wrapper });

        const text = getByText(container, form.description);
        expect(text).to.exist;
        expect(text.textContent).to.equal(form.description);
    });

    describe('variant', function () {
        it('uses Text component by default', function () {
            const { container } = render(<Help form={form} />, { wrapper });

            const el = container.querySelector('.mantine-Text-root');
            expect(el).to.exist;
        });

        it('uses Title component when variant starts with h', function () {
            form = { ...form, variant: 'h2' };
            const { container } = render(<Help form={form} />, { wrapper });

            const el = container.querySelector('.mantine-Title-root');
            expect(el).to.exist;
        });

        it('sets Title size to the variant value', function () {
            form = { ...form, variant: 'h3' };
            const { container } = render(<Help form={form} />, { wrapper });

            const el = container.querySelector('.mantine-Title-root');
            expect(el).to.exist;
            expect(el.getAttribute('data-size')).to.equal('h3');
        });

        it('renders as span when variant is span', function () {
            form = { ...form, variant: 'span' };
            const { container } = render(<Help form={form} />, { wrapper });

            const el = container.querySelector('.mantine-Text-root');
            expect(el).to.exist;
            expect(el.tagName.toLowerCase()).to.equal('span');
        });
    });

    describe('text attributes', function () {
        it('applies default size of sm', function () {
            const { container } = render(<Help form={form} />, { wrapper });

            const el = container.querySelector('.mantine-Text-root');
            expect(el.getAttribute('data-size')).to.equal('sm');
        });

        it('applies a custom size', function () {
            form = { ...form, size: 'lg' };
            const { container } = render(<Help form={form} />, { wrapper });

            const el = container.querySelector('.mantine-Text-root');
            expect(el.getAttribute('data-size')).to.equal('lg');
        });

        it('applies color', function () {
            form = { ...form, color: 'red' };
            const { container } = render(<Help form={form} />, { wrapper });

            const el = container.querySelector('.mantine-Text-root');
            expect(el.getAttribute('style')).to.include(
                'color: var(--mantine-color-red-text)'
            );
        });
    });
});
