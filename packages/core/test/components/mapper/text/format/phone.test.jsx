import { describe, it } from 'mocha';
import * as chai from 'chai';
import React from 'react';
import { render, fireEvent, renderHook } from '@testing-library/react';
import { RenderingContext, ModelContext } from '@forml/context';
import { useModelStore } from '@forml/hooks';
import PhoneNumber from '../../../../../src/components/mapper/text/format/phone.jsx';

const { expect } = chai;

describe('PhoneNumber Component', function () {
    const mockRenderingContext = {
        prefix: '',
        decorator: {
            text: ({ form, value, onChange }) => (
                <input
                    data-testid="phone-input"
                    value={value || ''}
                    onChange={onChange}
                />
            ),
        },
        localizer: (value) => value,
    };

    function makeWrapper(modelStore) {
        return ({ children }) => (
            <RenderingContext.Provider value={mockRenderingContext}>
                <ModelContext.Provider value={modelStore}>
                    {children}
                </ModelContext.Provider>
            </RenderingContext.Provider>
        );
    }

    it('renders phone input field', function () {
        const schema = {
            type: 'object',
            properties: {
                phone: { type: 'string', format: 'phone' },
            },
        };
        const model = { phone: '' };
        const modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;

        const form = { key: 'phone' };
        const mockOnChangeSet = () => {};

        const { getByTestId } = render(
            <PhoneNumber form={form} onChangeSet={mockOnChangeSet} />,
            { wrapper: makeWrapper(modelStore) }
        );

        expect(getByTestId('phone-input')).to.exist;
    });

    it('formats phone number on input change', function () {
        const schema = {
            type: 'object',
            properties: {
                phone: { type: 'string', format: 'phone' },
            },
        };
        const model = { phone: '' };
        const modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;

        const form = { key: 'phone' };
        let capturedEvent = null;
        let capturedValue = null;
        const mockOnChangeSet = (event, value) => {
            capturedEvent = event;
            capturedValue = value;
        };

        const { getByTestId } = render(
            <PhoneNumber form={form} onChangeSet={mockOnChangeSet} />,
            { wrapper: makeWrapper(modelStore) }
        );

        const input = getByTestId('phone-input');

        // Simulate typing a phone number
        fireEvent.change(input, { target: { value: '1234567890' } });

        expect(capturedEvent).to.exist;
        expect(capturedValue).to.be.a('string');
        expect(capturedValue).to.equal('1 (234) 567-890'); // Should be formatted as US phone number
    });

    it('handles partial phone number input', function () {
        const schema = {
            type: 'object',
            properties: {
                phone: { type: 'string', format: 'phone' },
            },
        };
        const model = { phone: '' };
        const modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;

        const form = { key: 'phone' };
        let capturedValue = null;
        const mockOnChangeSet = (event, value) => {
            capturedValue = value;
        };

        const { getByTestId } = render(
            <PhoneNumber form={form} onChangeSet={mockOnChangeSet} />,
            { wrapper: makeWrapper(modelStore) }
        );

        const input = getByTestId('phone-input');

        // Simulate typing partial phone number
        fireEvent.change(input, { target: { value: '123' } });

        expect(capturedValue).to.equal('1 23'); // Partial number should still be processed
    });

    it('uses existing phone value from model', function () {
        const schema = {
            type: 'object',
            properties: {
                phone: { type: 'string', format: 'phone' },
            },
        };
        const model = { phone: '(555) 123-4567' };
        const modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;

        const form = { key: 'phone' };
        const mockOnChangeSet = () => {};

        const { getByTestId } = render(
            <PhoneNumber form={form} onChangeSet={mockOnChangeSet} />,
            { wrapper: makeWrapper(modelStore) }
        );

        const input = getByTestId('phone-input');
        expect(input.value).to.equal('(555) 123-4567');
    });
});

