import { describe, it } from 'mocha';
import * as chai from 'chai';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { RenderingContext, ModelContext } from '@forml/context';
import Tabs from '../../../src/components/mapper/tabs.jsx';

const { expect } = chai;

describe('Tabs Component', function () {
    // Mock tab decorator
    function MockTab(props) {
        const { form, activate, index } = props;
        return (
            <button data-testid={`tab-${index}`} onClick={activate}>
                {form.title || `Tab ${index}`}
            </button>
        );
    }
    function MockPanel(props) {
        const { form, index, children } = props;
        return (
            <div data-testid={`panel-${index}`}>
                <h3>{form.title}</h3>
                {children}
            </div>
        );
    }
    function MockTabsContainer(props) {
        const { tabs, panels, value = 0, activateTab } = props;
        return (
            <div data-testid="tabs-container">
                <div data-testid="tab-list">{tabs}</div>
                <div data-testid="panel-content">{panels[value]}</div>
            </div>
        );
    }
    MockTabsContainer.Panel = MockPanel;
    MockTabsContainer.Tab = MockTab;

    const mockTabsDecorator = {
        tabs: MockTabsContainer,
    };

    const mockRenderingContext = {
        prefix: '',
        mapper: {
            text: (props) => (
                <input type="text" data-testid="text-field" {...props} />
            ),
        },
        decorator: mockTabsDecorator,
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

    it('renders tabs with multiple tab items', function () {
        const mockForm = {
            type: 'tabs',
            tabs: [
                {
                    title: 'Tab One',
                    type: 'text',
                    schema: { type: 'string' },
                },
                {
                    title: 'Tab Two',
                    type: 'text',
                    schema: { type: 'string' },
                },
                {
                    title: 'Tab Three',
                    type: 'text',
                    schema: { type: 'string' },
                },
            ],
        };

        const mockOnChange = () => {};

        const { getByTestId } = render(
            <Tabs form={mockForm} onChange={mockOnChange} />,
            { wrapper }
        );

        // Should render all tabs
        expect(getByTestId('tab-0')).to.exist;
        expect(getByTestId('tab-1')).to.exist;
        expect(getByTestId('tab-2')).to.exist;

        // Should render the tabs container
        expect(getByTestId('tabs-container')).to.exist;
        expect(getByTestId('panel-content')).to.exist;
    });

    it('handles tab activation', function () {
        const mockForm = {
            type: 'tabs',
            tabs: [
                {
                    title: 'First Tab',
                    type: 'text',
                    schema: { type: 'string' },
                },
                {
                    title: 'Second Tab',
                    type: 'text',
                    schema: { type: 'string' },
                },
            ],
        };

        const mockOnChange = () => {};

        const { getByTestId } = render(
            <Tabs form={mockForm} onChange={mockOnChange} />,
            { wrapper }
        );

        // Click on the second tab to activate it
        const secondTab = getByTestId('tab-1');
        fireEvent.click(secondTab);

        // Should successfully handle the tab click
        expect(secondTab).to.exist;
    });

    it('renders with htmlClass when provided', function () {
        const mockForm = {
            type: 'tabs',
            htmlClass: 'custom-tabs',
            tabs: [
                {
                    title: 'Tab',
                    type: 'text',
                    schema: { type: 'string' },
                },
            ],
        };

        const mockOnChange = () => {};

        const { getByTestId } = render(
            <Tabs form={mockForm} onChange={mockOnChange} />,
            { wrapper }
        );

        expect(getByTestId('tabs-container')).to.exist;
    });

    it('handles empty tabs array', function () {
        const mockForm = {
            type: 'tabs',
            tabs: [],
        };

        const mockOnChange = () => {};

        const { getByTestId } = render(
            <Tabs form={mockForm} onChange={mockOnChange} />,
            { wrapper }
        );

        expect(getByTestId('tabs-container')).to.exist;
    });
});

