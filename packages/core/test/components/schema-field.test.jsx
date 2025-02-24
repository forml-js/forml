import { describe, it } from 'mocha';
import * as chai from 'chai';
import sinonChai from 'sinon-chai';
import domChai from 'chai-dom';
import * as sinon from 'sinon';
import { SchemaField } from '#field';
import { getLocalizer } from '#localizer';
import { getMapper } from '#mapper';
import { ModelContext, RenderingContext } from '@forml/context';
import * as barebones from '@forml/decorator-barebones';
import { render } from '@testing-library/react';
import React from 'react';
import { createStore } from 'zustand';

chai.use(sinonChai);
chai.use(domChai);
const { expect } = chai;

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
            array: sinon.fake(() => 'array'),
            checkbox: sinon.fake(() => 'checkbox'),
            date: sinon.fake(() => 'date'),
            datetime: sinon.fake(() => 'datetime'),
            dynamic: sinon.fake(() => 'dynamic'),
            fieldset: sinon.fake(() => 'fieldset'),
            help: sinon.fake(() => 'help'),
            integer: sinon.fake(() => 'integer'),
            multiselect: sinon.fake(() => 'multiselect'),
            null: sinon.fake(() => 'null'),
            number: sinon.fake(() => 'number'),
            password: sinon.fake(() => 'password'),
            select: sinon.fake(() => 'select'),
            tabs: sinon.fake(() => 'tabs'),
            text: sinon.fake(() => 'text'),
            textarea: sinon.fake(() => 'textarea'),
            tuple: sinon.fake(() => 'tuple'),
            file: sinon.fake(() => 'file'),
        }),
    };
}

describe('SchemaField', function () {
    it('does not render if no mapped Field is found for type', function () {
        const schema = { type: 'object' };
        const form = { key: [], type: 'custom', schema };
        const validate = sinon.fake();
        const ajv = { compile: sinon.fake(() => validate) };
        const modelContext = getModelContext(schema, ajv, {});
        const renderingContext = getRenderingContext();

        const { container } = render(
            <RenderingContext.Provider value={renderingContext}>
                <ModelContext.Provider value={modelContext}>
                    <SchemaField form={form} schema={schema} />
                </ModelContext.Provider>
            </RenderingContext.Provider>
        );

        expect(container).to.be.empty;
    });

    it('uses mapper from context', function () {
        const schema = { type: 'string' };
        const form = { key: [], type: 'text', schema };
        const validate = sinon.fake();
        const ajv = { compile: sinon.fake(() => validate) };
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
