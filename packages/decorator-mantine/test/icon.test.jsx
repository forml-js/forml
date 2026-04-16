import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModelContext, RenderingContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import { render, renderHook, screen } from '@testing-library/react';
import Icon from '../src/icon.jsx';
import { withOptions } from '../src/index.jsx';

function makeWrapper() {
    return ({ children }) => <MantineProvider>{children}</MantineProvider>;
}

describe('renders', function () {
    let wrapper;
    beforeEach(function () {
        wrapper = makeWrapper({});
    });
    describe('when given a known icon', function () {
        it('renders the desired icon', function () {
            const { container } = render(<Icon icon="info" />, { wrapper });
            const icon = container.querySelector('svg');
            expect(icon).to.exist;
            expect(icon.getAttribute('data-icon')).to.equal('InfoIcon');
        });
    });
    describe('when given an unknown icon', function () {
        it('renders XCircleIcon instead', function () {
            const { container } = render(<Icon icon="fizzbuzz" />, { wrapper });
            const icon = container.querySelector('svg');
            expect(icon).to.exist;
            expect(icon.getAttribute('data-icon')).to.equal('XCircleIcon');
        });
    });
});
