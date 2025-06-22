import { it, describe } from 'mocha';
import { expect } from 'chai';
import DateComponent from '../../src/date.jsx';
import { ModelContext, RenderingContext } from '@forml/context';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { withOptions } from '../../src/index.jsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useModelStore } from '@forml/hooks';
import moment from 'moment';
import 'moment-timezone';

moment.tz.setDefault('GMT');

function makeWrapper({ modelStore, renderingContext }) {
    return ({ children }) => (
        <RenderingContext.Provider value={renderingContext}>
            <ModelContext.Provider value={modelStore}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    {children}
                </LocalizationProvider>
            </ModelContext.Provider>
        </RenderingContext.Provider>
    );
}
describe('renders', function () {
    let form;
    let inputValue;
    let onChange;
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        form = { type: 'date' };
        inputValue = new Date(0);
        schema = { type: 'object', properties: { field: { type: 'string' } } };
        model = {};
        modelStore = renderHook(() => useModelStore(schema, model)).result
            .current;
        decorator = withOptions({});
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
        onChange = function () {}; // Mock onChange function
    });

    describe('with form options', function () {
        let fields = {
            disablePast: [true, false],
            disableFuture: [true, false],
            variant: ['inline', 'dialog'],
            fullWidth: [true, false],
            autoOk: [true, false],
            openTo: ['date', 'year', 'month'],
            format: ['YYYY/MM/DD', 'LL'],
            readonly: [true, false],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    it(`${value}`, function () {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <DateComponent
                                form={form}
                                value={inputValue}
                                onChange={onChange}
                            />,
                            { wrapper }
                        );

                        // Verify component renders without errors
                        expect(container.firstChild).to.not.be.null;

                        // Verify MUI DatePicker is present
                        const dateInput = container.querySelector(
                            'input[type="text"], input[placeholder*="MM"], .MuiInputBase-input'
                        );
                        expect(dateInput).to.not.be.null;
                    });
                });
            });
        });
    });
});
