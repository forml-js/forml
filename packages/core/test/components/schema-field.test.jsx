import { SchemaField } from '#field';
import { getLocalizer } from '#localizer';
import { getMapper } from '#mapper';
import { ModelContext, RenderingContext } from '@forml/context';
import * as barebones from '@forml/decorator-barebones';
import { render } from '@testing-library/react';
import React from 'react';
import { createStore } from 'zustand';

function getModelContext(schema, ajv, model = '', errors = {}) {
    return createStore()((set) => ({
        ajv,
        schema,
        model,
        errors,
        setValue: (key, value) => set({ model: { ...model, [key]: value } }),
    }));
}

function getRenderingContext() {
    return {
        decorator: barebones,
        localizer: getLocalizer({}),
        mapper: getMapper({
            array: vi.fn(() => 'array'),
            checkbox: vi.fn(() => 'checkbox'),
            date: vi.fn(() => 'date'),
            datetime: vi.fn(() => 'datetime'),
            dynamic: vi.fn(() => 'dynamic'),
            fieldset: vi.fn(() => 'fieldset'),
            help: vi.fn(() => 'help'),
            integer: vi.fn(() => 'integer'),
            multiselect: vi.fn(() => 'multiselect'),
            null: vi.fn(() => 'null'),
            number: vi.fn(() => 'number'),
            password: vi.fn(() => 'password'),
            select: vi.fn(() => 'select'),
            tabs: vi.fn(() => 'tabs'),
            text: vi.fn(() => 'text'),
            textarea: vi.fn(() => 'textarea'),
            tuple: vi.fn(() => 'tuple'),
            file: vi.fn(() => 'file'),
        }),
    };
}

describe('SchemaField', function () {
    it('does not render if no mapped Field is found for type', function () {
        const schema = { type: 'object' };
        const form = { key: [], type: 'custom', schema };
        const validate = vi.fn();
        const ajv = { compile: vi.fn(() => validate) };
        const modelContext = getModelContext(schema, ajv, {});
        const renderingContext = getRenderingContext();

        const { container } = render(
            <RenderingContext.Provider value={renderingContext}>
                <ModelContext.Provider value={modelContext}>
                    <SchemaField form={form} schema={schema} />
                </ModelContext.Provider>
            </RenderingContext.Provider>
        );

        expect(container.children).to.be.empty;
    });

    it('uses mapper from context', function () {
        const schema = { type: 'string' };
        const form = { key: [], type: 'text', schema };
        const validate = vi.fn();
        const ajv = { compile: vi.fn(() => validate) };
        const modelContext = getModelContext(schema, ajv, {});
        const renderingContext = getRenderingContext();

        const _component = render(
            <RenderingContext.Provider value={renderingContext}>
                <ModelContext.Provider value={modelContext}>
                    <SchemaField form={form} schema={schema} />
                </ModelContext.Provider>
            </RenderingContext.Provider>
        );

        expect(renderingContext.mapper.text).to.have.been.called;
    });
});
