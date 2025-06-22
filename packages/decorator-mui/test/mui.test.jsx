import { it, describe } from 'mocha';
import { expect } from 'chai';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { render } from '@testing-library/react';
import { SchemaForm, util } from '@forml/core';
import React from 'react';
import * as mui from '../';
import { withOptions } from '../src/index.jsx';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({});
let wrapper;

beforeEach(function () {
    wrapper = ({ children }) => (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                {children}
            </LocalizationProvider>
        </ThemeProvider>
    );
});

describe('Material UI', function () {
    describe('with no model', function () {
        const tests = [
            ['root string', { type: 'string' }],
            ['root number', { type: 'number' }],
            ['root integer', { type: 'integer' }],
            ['root date', { type: 'string', format: 'date' }, '2020-01-01'],
            // ['root date-time', { type: 'string', format: 'date-time' }],
            ['root enumeration', { type: 'string', enum: ['a', 'b', 'c'] }],
            [
                'root multiselect',
                {
                    type: 'array',
                    items: { type: 'string', enum: ['a', 'b', 'c'] },
                    uniqueItems: true,
                },
            ],
            //[
            //    'root tuple',
            //    { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
            //],
            //['root array', { type: 'array', items: { type: 'string' } }],
            [
                'root object',
                {
                    type: 'object',
                    properties: {
                        test: { type: 'string' },
                        nested: {
                            type: 'object',
                            properties: {
                                property: { type: 'number' },
                            },
                        },
                    },
                },
            ],
        ];

        const form = ['*'];
        const decorator = withOptions({});

        for (let [name, schema, maybeModel] of tests) {
            it(`renders empty ${name} consistently`, function () {
                const model = maybeModel ?? util.defaultForSchema(schema);
                const { container } = render(
                    <SchemaForm
                        schema={schema}
                        form={form}
                        model={model}
                        decorator={decorator}
                    />,
                    { wrapper }
                );

                // Check that the form container renders
                expect(container).to.exist;
                // Check for at least one input or label in the form
                const input = container.querySelector(
                    'input, select, textarea'
                );
                const label = container.querySelector('label');
                expect(input || label).to.exist;
            });
        }
    });
});
