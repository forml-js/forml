import React from 'react';
import { MantineProvider, Tabs } from '@mantine/core';
import { RenderingContext } from '@forml/context';
import { render, fireEvent, getByText } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import Container from '../src/tabs/container.jsx';
import Tab from '../src/tabs/tab.jsx';
import Panel from '../src/tabs/panel.jsx';
import { withOptions } from '../src/index.jsx';

function makeWrapper({ renderingContext }) {
    return ({ children }) => (
        <MantineProvider>
            <RenderingContext.Provider value={renderingContext}>
                {children}
            </RenderingContext.Provider>
        </MantineProvider>
    );
}

function makeTabsWrapper({ value = '0' } = {}) {
    return ({ children }) => (
        <MantineProvider>
            <Tabs value={value}>{children}</Tabs>
        </MantineProvider>
    );
}

describe('Container', function () {
    let form;
    let decorator;
    let wrapper;
    let activateTab;

    beforeEach(function () {
        form = { title: 'My Tabs', description: 'Tab description' };
        decorator = withOptions({});
        wrapper = makeWrapper({ renderingContext: { decorator } });
        activateTab = sinon.spy();
    });

    it('renders the tabs root', function () {
        const { container } = render(
            <Container
                form={form}
                value={0}
                activateTab={activateTab}
                tabs={[]}
                panels={[]}
            />,
            { wrapper }
        );

        const el = container.querySelector('.forml-tabs-root');
        expect(el).to.exist;
    });

    it('renders the tabs list', function () {
        const { container } = render(
            <Container
                form={form}
                value={0}
                activateTab={activateTab}
                tabs={[]}
                panels={[]}
            />,
            { wrapper }
        );

        const list = container.querySelector('.forml-tabs-list');
        expect(list).to.exist;
    });

    it('renders the tabs', function () {
        const tabs = [
            <Tabs.Tab key="0" value="0">
                First
            </Tabs.Tab>,
            <Tabs.Tab key="1" value="1">
                Second
            </Tabs.Tab>,
        ];
        const { container } = render(
            <Container
                form={form}
                value={0}
                activateTab={activateTab}
                tabs={tabs}
                panels={[]}
            />,
            { wrapper }
        );

        expect(getByText(container, 'First')).to.exist;
        expect(getByText(container, 'Second')).to.exist;
    });

    it('renders the panels', function () {
        const panels = [
            <Tabs.Panel key="0" value="0">
                <div className="panel-content">Panel 0</div>
            </Tabs.Panel>,
        ];
        const { container } = render(
            <Container
                form={form}
                value={0}
                activateTab={activateTab}
                tabs={[]}
                panels={panels}
            />,
            { wrapper }
        );

        const panel = container.querySelector('.panel-content');
        expect(panel).to.exist;
    });

    it('calls activateTab when a tab is clicked', function () {
        const tabs = [
            <Tabs.Tab key="0" value="0">
                First
            </Tabs.Tab>,
            <Tabs.Tab key="1" value="1">
                Second
            </Tabs.Tab>,
        ];
        const { container } = render(
            <Container
                form={form}
                value={0}
                activateTab={activateTab}
                tabs={tabs}
                panels={[]}
            />,
            { wrapper }
        );

        const secondTab = getByText(container, 'Second');
        fireEvent.click(secondTab);
        expect(activateTab.calledOnce).to.be.true;
        expect(activateTab.firstCall.args[0]).to.equal('1');
    });

    describe('header', function () {
        it('renders when title is present', function () {
            const { container } = render(
                <Container
                    form={form}
                    value={0}
                    activateTab={activateTab}
                    tabs={[]}
                    panels={[]}
                />,
                { wrapper }
            );

            const header = container.querySelector('.forml-tabs-header');
            expect(header).to.exist;
        });

        it('renders the title', function () {
            const { container } = render(
                <Container
                    form={form}
                    value={0}
                    activateTab={activateTab}
                    tabs={[]}
                    panels={[]}
                />,
                { wrapper }
            );

            const title = getByText(container, form.title);
            expect(title).to.exist;
        });

        it('renders the description', function () {
            const { container } = render(
                <Container
                    form={form}
                    value={0}
                    activateTab={activateTab}
                    tabs={[]}
                    panels={[]}
                />,
                { wrapper }
            );

            const desc = getByText(container, form.description);
            expect(desc).to.exist;
        });

        it('does not render when no title or description', function () {
            form = {};
            const { container } = render(
                <Container
                    form={form}
                    value={0}
                    activateTab={activateTab}
                    tabs={[]}
                    panels={[]}
                />,
                { wrapper }
            );

            const header = container.querySelector('.forml-tabs-header');
            expect(header).to.not.exist;
        });
    });

    describe('orientation', function () {
        it('defaults to horizontal', function () {
            const { container } = render(
                <Container
                    form={form}
                    value={0}
                    activateTab={activateTab}
                    tabs={[]}
                    panels={[]}
                />,
                { wrapper }
            );

            const tabs = container.querySelector('.forml-tabs');
            expect(tabs.getAttribute('data-orientation')).to.equal(
                'horizontal'
            );
        });

        it('uses vertical orientation when layout is horizontal', function () {
            form = { ...form, layout: 'horizontal' };
            const { container } = render(
                <Container
                    form={form}
                    value={0}
                    activateTab={activateTab}
                    tabs={[]}
                    panels={[]}
                />,
                { wrapper }
            );

            const tabs = container.querySelector('.forml-tabs');
            expect(tabs.getAttribute('data-orientation')).to.equal('vertical');
        });

        it('uses horizontal orientation when layout is vertical', function () {
            form = { ...form, layout: 'vertical' };
            const { container } = render(
                <Container
                    form={form}
                    value={0}
                    activateTab={activateTab}
                    tabs={[]}
                    panels={[]}
                />,
                { wrapper }
            );

            const tabs = container.querySelector('.forml-tabs');
            expect(tabs.getAttribute('data-orientation')).to.equal(
                'horizontal'
            );
        });
    });

    describe('with filled option', function () {
        beforeEach(function () {
            decorator = withOptions({ filled: true });
            wrapper = makeWrapper({ renderingContext: { decorator } });
        });

        it('adds forml-filled class to the root', function () {
            const { container } = render(
                <Container
                    form={form}
                    value={0}
                    activateTab={activateTab}
                    tabs={[]}
                    panels={[]}
                />,
                { wrapper }
            );

            const el = container.querySelector('.forml-tabs-root');
            expect(el.classList.contains('forml-filled')).to.be.true;
        });
    });

    describe('without filled option', function () {
        it('does not add forml-filled class', function () {
            const { container } = render(
                <Container
                    form={form}
                    value={0}
                    activateTab={activateTab}
                    tabs={[]}
                    panels={[]}
                />,
                { wrapper }
            );

            const el = container.querySelector('.forml-tabs-root');
            expect(el.classList.contains('forml-filled')).to.be.false;
        });
    });
});

describe('Tab', function () {
    let form;
    let wrapper;

    beforeEach(function () {
        form = { title: 'First Tab' };
        wrapper = makeTabsWrapper({ value: '0' });
    });

    it('renders the tab title', function () {
        const { container } = render(<Tab form={form} index={0} />, {
            wrapper,
        });

        const tab = getByText(container, form.title);
        expect(tab).to.exist;
    });

    it('uses the index as the tab value', function () {
        const { container } = render(<Tab form={form} index={2} />, {
            wrapper,
        });

        const tab = container.querySelector('[data-index="2"]');
        expect(tab).to.exist;
    });

    it('renders an icon when form.icon is set', function () {
        form = { ...form, icon: 'info' };
        const { container } = render(<Tab form={form} index={0} />, {
            wrapper,
        });

        const icon = container.querySelector('svg');
        expect(icon).to.exist;
    });

    it('does not render an icon when form.icon is not set', function () {
        const { container } = render(<Tab form={form} index={0} />, {
            wrapper,
        });

        const icon = container.querySelector('svg');
        expect(icon).to.not.exist;
    });
});

describe('Panel', function () {
    let wrapper;

    beforeEach(function () {
        wrapper = makeTabsWrapper({ value: '0' });
    });

    it('renders children', function () {
        const { container } = render(
            <Panel index={0}>
                <div className="panel-child">content</div>
            </Panel>,
            { wrapper }
        );

        const child = container.querySelector('.panel-child');
        expect(child).to.exist;
        expect(child.textContent).to.equal('content');
    });

    it('renders with the forml-tabs-panel class', function () {
        const { container } = render(<Panel index={0}>{[]}</Panel>, {
            wrapper,
        });

        const panel = container.querySelector('.forml-tabs-panel');
        expect(panel).to.exist;
    });

    it('uses the index as the panel value', function () {
        const { container } = render(<Panel index={3}>{[]}</Panel>, {
            wrapper,
        });

        const panel = container.querySelector('[data-index="3"]');
        expect(panel).to.exist;
    });
});
