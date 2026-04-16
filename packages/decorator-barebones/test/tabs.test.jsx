import { expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Panel from '../src/tabs/panel.jsx';
import Tab from '../src/tabs/tab.jsx';

describe('Barebones Tabs Components', function () {
    describe('Panel', function () {
        it('renders panel with children', function () {
            const { container } = render(
                <Panel active={true}>
                    <div>Panel content</div>
                </Panel>
            );

            const panel = container.querySelector('div[active="true"]');
            expect(panel).to.exist;
            expect(panel.textContent).to.equal('Panel content');
        });

        it('renders panel with active false', function () {
            const { container } = render(
                <Panel active={false}>
                    <div>Panel content</div>
                </Panel>
            );

            const panel = container.querySelector('div:not([active="true"])');
            expect(panel).to.exist;
        });
    });

    describe('Tab', function () {
        it('renders tab button with title', function () {
            const mockActivate = () => {};
            const form = { title: 'Test Tab' };

            const { container } = render(
                <Tab form={form} activate={mockActivate} />
            );

            const button = container.querySelector('button');
            expect(button).to.exist;
            expect(button.textContent).to.equal('Test Tab');
        });

        it('calls activate on button click', function () {
            let activated = false;
            const mockActivate = () => {
                activated = true;
            };
            const form = { title: 'Clickable Tab' };

            const { container } = render(
                <Tab form={form} activate={mockActivate} />
            );

            const button = container.querySelector('button');
            button.click();
            expect(activated).to.be.true;
        });
    });
});
