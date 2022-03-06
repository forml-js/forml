import { Container, Tab, Panel } from '../';
import Context from '@forml/context';
import React from 'react';
import { render } from '@testing-library/react';
import * as decorator from '../';

describe('renders', function () {
    let form;
    let title = 'title';
    let description = 'description';
    let tabs = [];
    let panels = [];

    beforeEach(function () {
        form = {
            type: 'container',
            tabs: [{ type: 'fieldset', items: [{ key: [] }] }],
        };
        tabs = [
            <Tab form={form.tabs[0]} parent={form}>
                Test Tab
            </Tab>,
        ];
        panels = [
            <Panel form={form.tabs[0]} parent={form}>
                Test Panel
            </Panel>,
        ];
    });

    describe('with form options', function () {
        let fields = {
            layout: ['horizontal', 'vertical'],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    test(`${value}`, function () {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <Context.Provider value={{ decorator }}>
                                <Container
                                    form={form}
                                    title={title}
                                    description={description}
                                    tabs={tabs}
                                    panels={panels}
                                />
                            </Context.Provider>
                        );

                        expect(container).toMatchSnapshot();
                    });
                });
            });
        });
    });

    test('with title and description', function () {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Container
                    form={form}
                    title={title}
                    description={description}
                    tabs={tabs}
                    panels={panels}
                />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test('with title and no description', function () {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Container
                    form={form}
                    title={title}
                    tabs={tabs}
                    panels={panels}
                />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test('with description and no title', function () {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Container
                    form={form}
                    description={title}
                    tabs={tabs}
                    panels={panels}
                />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test('with no title or description', function () {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Container form={form} tabs={tabs} panels={panels}></Container>
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });
});
