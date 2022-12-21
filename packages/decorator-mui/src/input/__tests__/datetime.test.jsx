import DateTime from '../datetime';
import Context from '@forml/context';
import React from 'react';
import { render } from '@testing-library/react';
import * as decorator from '../../';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import 'moment-timezone';

moment.tz.setDefault('GMT');

describe('renders', function () {
    let form;
    let inputValue;

    beforeEach(function () {
        form = { type: 'datetime' };
        inputValue = new Date(0).toISOString();
    });

    describe('with form options', function () {
        let fields = {
            disablePast: [true, false],
            disableFuture: [true, false],
            variant: ['inline', 'dialog'],
            fullWidth: [true, false],
            autoOk: [true, false],
            openTo: ['datetime', 'year', 'month'],
            format: ['YYYY/MM/DD HH:mm:ss', 'LLLL'],
            readonly: [true, false],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    test(`${value}`, function () {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <Context.Provider value={{ decorator }}>
                                    <DateTime form={form} value={inputValue} />
                                </Context.Provider>
                            </LocalizationProvider>
                        );

                        expect(container).toMatchSnapshot();
                    });
                });
            });
        });
    });
});
