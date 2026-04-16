import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { RenderingContext, ModelContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import Dynamic from '../../../src/components/mapper/dynamic.jsx';

const { expect } = chai;

describe('Dynamic Component', function () {
    const mockRenderingContext = {
        prefix: '',
        mapper: {
            text: () => <input type="text" data-testid="text-field" />,
        },
        decorator: {},
        localizer: (value) => value,
    };

    function makeWrapper({ modelStore }) {
        return ({ children }) => (
            <RenderingContext.Provider value={mockRenderingContext}>
                <ModelContext.Provider value={modelStore}>
                    {children}
                </ModelContext.Provider>
            </RenderingContext.Provider>
        );
    }

    it('renders with dynamic form generation', function () {
        const schema = {
            type: 'object',
            properties: {
                dynamicField: { type: 'string' },
            },
        };
        const model = {};
        const modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;

        const mockForm = {
            key: 'dynamicField',
            generate: [
                {
                    type: 'text',
                    title: 'Dynamic Field',
                },
            ],
        };

        const mockOnChange = () => {};
        const wrapper = makeWrapper({ modelStore });

        const { getByTestId } = render(
            <Dynamic form={mockForm} onChange={mockOnChange} />,
            { wrapper }
        );

        // The dynamic component should render the generated form
        expect(getByTestId('text-field')).to.exist;
    });

    it('creates proper nested context with prefix', function () {
        const schema = {
            type: 'object',
            properties: {
                nested: {
                    type: 'object',
                    properties: {
                        field: { type: 'string' },
                    },
                },
            },
        };
        const model = {};
        const modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;

        const mockForm = {
            key: 'nested.field',
            generate: [
                {
                    type: 'text',
                    title: 'Nested Dynamic Field',
                },
            ],
        };

        const mockOnChange = () => {};
        const wrapper = makeWrapper({ modelStore });

        // Just ensure it renders without error
        const { container } = render(
            <Dynamic form={mockForm} onChange={mockOnChange} />,
            { wrapper }
        );

        expect(container.firstChild).to.exist;
    });
});
