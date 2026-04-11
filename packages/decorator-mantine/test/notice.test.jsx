import React from 'react';
import { MantineProvider } from '@mantine/core';
import { render, getByText } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import Notice from '../src/notice.jsx';

function wrapper({ children }) {
    return <MantineProvider>{children}</MantineProvider>;
}

describe('renders', function () {
    let form;

    beforeEach(function () {
        form = { type: 'notice', description: 'A notice message' };
    });

    it('renders the description', function () {
        const { container } = render(<Notice form={form} />, { wrapper });

        const text = getByText(container, form.description);
        expect(text).to.exist;
        expect(text.textContent).to.equal(form.description);
    });

    it('renders the alert root', function () {
        const { container } = render(<Notice form={form} />, { wrapper });

        const alert = container.querySelector('.mantine-Alert-root');
        expect(alert).to.exist;
    });

    it('uses filled variant by default', function () {
        const { container } = render(<Notice form={form} />, { wrapper });

        const alert = container.querySelector('.mantine-Alert-root');
        expect(alert.getAttribute('data-variant')).to.equal('filled');
    });

    it('uses the specified variant', function () {
        form = { ...form, variant: 'outline' };
        const { container } = render(<Notice form={form} />, { wrapper });

        const alert = container.querySelector('.mantine-Alert-root');
        expect(alert.getAttribute('data-variant')).to.equal('outline');
    });

    it('renders with a title', function () {
        form = { ...form, title: 'Alert Title' };
        const { container } = render(<Notice form={form} />, { wrapper });

        const title = container.querySelector('.mantine-Alert-title');
        expect(title).to.exist;
        expect(title.textContent).to.equal('Alert Title');
    });

    it('renders without a title', function () {
        const { container } = render(<Notice form={form} />, { wrapper });

        const title = container.querySelector('.mantine-Alert-title');
        expect(title).to.not.exist;
    });

    it('renders with an icon', function () {
        form = { ...form, icon: 'star' };
        const { container } = render(<Notice form={form} />, { wrapper });

        const icon = container.querySelector('.mantine-Alert-icon');
        expect(icon).to.exist;
    });

    it('renders without an icon when none is specified', function () {
        const { container } = render(<Notice form={form} />, { wrapper });

        const icon = container.querySelector('.mantine-Alert-icon');
        expect(icon).to.not.exist;
    });

    it('applies the specified color', function () {
        form = { ...form, color: 'red' };
        const { container } = render(<Notice form={form} />, { wrapper });

        const alert = container.querySelector('.mantine-Alert-root');
        expect(alert).to.exist;
        expect(alert.getAttribute('style')).to.include(
            '--alert-bg: var(--mantine-color-red-filled);'
        );
    });
});
