import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as jsf from 'json-schema-faker';
import { SchemaForm, getLocalizer, util } from '#core';
import * as barebones from '@forml/decorator-barebones';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

chai.use(sinonChai);
const { expect } = chai;

describe('mapper', function () {
    const title = 'title';
    const description = 'description';
    const decorator = barebones;
    let forms = [
        [
            {
                key: [],
                type: 'array',
                items: [],
                title,
                description,
                schema: { type: 'array', items: { type: 'string' } },
            },
        ],
        [
            {
                key: [],
                type: 'checkbox',
                title,
                description,
                schema: { type: 'boolean' },
            },
        ],
        [
            {
                key: [],
                type: 'date',
                title,
                description,
                schema: { type: 'string', format: 'date' },
            },
        ],
        [
            {
                key: [],
                type: 'datetime',
                title,
                description,
                schema: { type: 'string', format: 'date-time' },
            },
        ],
        [{ key: [], type: 'fieldset', items: [], title, description }],
        [
            {
                key: [],
                type: 'file',
                title,
                description,
                schema: { type: 'string' },
            },
        ],
        [{ key: [], type: 'help', title, description }],
        [
            {
                key: [],
                type: 'integer',
                title,
                description,
                schema: { type: 'integer' },
            },
        ],
        [
            {
                key: [],
                type: 'multiselect',
                title,
                description,
                titleMap: [
                    { name: 'a', value: 'a' },
                    { name: 'b', value: 'b' },
                    { name: 'c', value: 'c' },
                ],
                schema: {
                    type: 'array',
                    items: { type: 'string' },
                    enum: ['a', 'b', 'c'],
                    uniqueItems: true,
                },
            },
        ],
        [
            {
                key: [],
                type: 'number',
                title,
                description,
                schema: { type: 'number' },
            },
        ],
        [
            {
                key: [],
                type: 'select',
                title,
                description,
                titleMap: [
                    { name: 'a', value: 'a' },
                    { name: 'b', value: 'b' },
                    { name: 'c', value: 'c' },
                ],
                schema: { type: 'string', enum: ['a', 'b', 'c'] },
            },
        ],
        [
            {
                key: [],
                type: 'tabs',
                title,
                description,
                tabs: [],
            },
        ],
        [
            {
                key: [],
                type: 'text',
                title,
                description,
                schema: { type: 'string' },
            },
        ],
        [
            {
                key: [],
                type: 'textarea',
                title,
                description,
                schema: { type: 'string' },
            },
        ],
    ];

    for (let form of forms) {
        const [{ type, schema }] = form;

        it(`${type} localizes title and description`, function () {
            const model = schema ? util.defaultForSchema(schema) : null;
            const localizer = getLocalizer({
                getLocalizedString: sinon.fake(),
            });
            const { container } = render(
                <SchemaForm
                    model={model}
                    form={form}
                    schema={schema}
                    localizer={localizer}
                    decorator={decorator}
                />
            );

            expect(localizer.getLocalizedString).to.have.been.calledWith(title);
            expect(localizer.getLocalizedString).to.have.been.calledWith(
                description
            );
        });

        const excludeFromChangeEvents = ['file', 'checkbox', 'array'];
        const makeChangeMap = {
            select: (form, input, nextValue) =>
                userEvent.selectOptions(
                    input,
                    String(
                        form[0].titleMap.findIndex(
                            ({ value }) => value === nextValue
                        )
                    )
                ),
            multiselect: (form, input, nextValue) => {
                if (!Array.isArray(nextValue)) nextValue = [nextValue];
                userEvent.selectOptions(
                    input,
                    nextValue.map((nextValue) =>
                        String(
                            form[0].titleMap.findIndex(
                                ({ value }) => value === nextValue
                            )
                        )
                    ),
                    { multiple: true }
                );
            },
            datetime: (form, input, nextValue) =>
                userEvent.type(input, nextValue),
            default: (form, input, nextValue) =>
                fireEvent.change(input, {
                    target: { value: nextValue },
                }),
        };
        const valueGenerator = {
            datetime: (schema) => new Date(jsf.generate(schema)).toISOString(),
            default: jsf.generate,
        };
        if (schema && !excludeFromChangeEvents.includes(type)) {
            const model = util.defaultForSchema(schema);
            it(`${type} processes change events`, async function () {
                let newModel = sinon.fake();
                let onChange = (event, nextModel) => newModel(nextModel);
                let { container } = render(
                    <SchemaForm
                        decorator={decorator}
                        model={model}
                        form={form}
                        schema={schema}
                        onChange={onChange}
                    />
                );

                let inputs = container.querySelectorAll(
                    'input, select, textarea'
                );
                expect(inputs.length).to.be.greaterThan(0);

                for (let input of inputs) {
                    const generateValue =
                        valueGenerator[type] ?? valueGenerator.default;
                    const value = generateValue(schema);
                    const makeChange =
                        makeChangeMap[type] ?? makeChangeMap.default;
                    await makeChange(form, input, value);
                    expect(newModel).to.have.been.calledWith(value);
                    newModel.resetHistory();
                }
            });
        }
    }
});
