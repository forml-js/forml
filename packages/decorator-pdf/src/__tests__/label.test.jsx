import Label from '../label';
import Context from '@forml/context';
import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { render } from '@testing-library/react';
import * as decorator from '../';

describe('renders', function () {
    let styles;
    let title;
    let form = { type: 'fieldset', items: [] };

    beforeEach(function () {
        title = jest.fn(() => ({ border: '1px solid red' }));
        styles = {
            get title() {
                return title();
            },
        };
    });

    test('without formStyles', function () {
        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Label form={form} />
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
    });
    test('with relevant formStyles', function () {
        form = { type: 'checkbox', styles, key: [] };

        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Label form={form} />
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
        expect(title).toHaveBeenCalled();
    });
});
