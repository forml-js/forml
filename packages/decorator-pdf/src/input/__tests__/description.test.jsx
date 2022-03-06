import Description from '../description';
import Context from '@forml/context';
import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { render } from '@testing-library/react';
import * as decorator from '../../';

describe('renders', function () {
    let form;
    let title = 'title';
    let description = 'description';
    let styles;
    let descriptionStyles;

    beforeEach(function () {
        form = { type: 'fieldset', description: 'description' };

        descriptionStyles = jest.fn(() => ({ border: '1pt solid red' }));

        styles = {
            get description() {
                return descriptionStyles();
            },
        };
    });

    test('with title and description', function () {
        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Description
                        form={form}
                        title={title}
                        description={description}
                    >
                        {description}
                    </Description>
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
    });

    test('with title and no description', function () {
        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Description form={form} description={title}>
                        {description}
                    </Description>
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
    });

    test('with no title or description', function () {
        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Description form={form}>{description}</Description>
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
    });

    test('with relevant formStyles', function () {
        form = { ...form, styles };
        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Description form={form}>{description}</Description>
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
        expect(descriptionStyles).toHaveBeenCalled();
    });
});
