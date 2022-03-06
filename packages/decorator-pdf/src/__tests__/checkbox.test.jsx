import Checkbox from '../checkbox';
import Context from '@forml/context';
import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { render } from '@testing-library/react';
import * as decorator from '../';

describe('renders', function () {
    let form;
    let schema;
    let title = 'title';
    let description = 'description';
    let styles;
    let root;
    let header;
    let icon;

    beforeEach(function () {
        root = jest.fn(() => ({ border: '1px solid red' }));
        header = jest.fn(() => ({ border: '1px solid red' }));
        icon = jest.fn(() => ({ border: '1px solid red' }));
        schema = { type: 'boolean' };
        styles = {
            get root() {
                return root();
            },
            get header() {
                return header();
            },
            get icon() {
                return icon();
            },
        };
        form = { type: 'checkbox', key: [] };
    });

    test('with no title or description', function () {
        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Checkbox form={form} />
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
    });

    test('with title but no description', function () {
        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Checkbox form={form} title={title} />
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
    });

    test('when checked', function () {
        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Checkbox
                        form={form}
                        title={title}
                        description={description}
                        checked={true}
                    />
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
    });

    test('with optional formStyles', function () {
        form = { type: 'checkbox', styles, key: [] };

        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Checkbox
                        form={form}
                        title={title}
                        description={description}
                    />
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
        expect(root).toHaveBeenCalled();
        expect(header).toHaveBeenCalled();
        expect(icon).toHaveBeenCalled();
    });
});
