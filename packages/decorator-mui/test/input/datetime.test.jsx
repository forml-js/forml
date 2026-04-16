import DateTime from '../../src/datetime.jsx';
import { ModelContext, RenderingContext } from '@forml/context';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { withOptions } from '../../src/index.jsx';
import { useModelStore } from '@forml/hooks';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import 'moment-timezone';

moment.tz.setDefault('GMT');

function makeWrapper({ modelStore, renderingContext }) {
    return ({ children }) => (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <RenderingContext.Provider value={renderingContext}>
                <ModelContext.Provider value={modelStore}>
                    {children}
                </ModelContext.Provider>
            </RenderingContext.Provider>
        </LocalizationProvider>
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
        form = { type: 'datetime' };
        inputValue = new Date(0).toISOString();
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
            openTo: ['day', 'year', 'month'],
            format: ['YYYY/MM/DD HH:mm:ss', 'LLLL'],
            readonly: [true, false],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    it(`${value}`, function () {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <DateTime
                                form={form}
                                value={inputValue}
                                onChange={onChange}
                            />,
                            { wrapper }
                        );

                        // Verify the DateTimePicker component renders
                        const dateTimePicker = container.querySelector(
                            '.MuiPickersInputBase-root'
                        );
                        expect(dateTimePicker).to.exist;

                        // Verify the input element exists
                        const input = container.querySelector('input');
                        expect(input).to.exist;
                    });
                });
            });
        });
    });
});
