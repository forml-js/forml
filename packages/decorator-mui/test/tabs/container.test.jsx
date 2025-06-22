import { it, describe } from 'mocha';
import { expect } from 'chai';
import { Container, Tab, Panel } from '../../src/tabs/index.jsx';
import Context from '@forml/context';
import React from 'react';
import { render, getByText } from '@testing-library/react';
import * as decorator from '../../';

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
                    it(`${value}`, function () {
                        form = { ...form, title, description, [field]: value };
                        const { container } = render(
                            <Context.Provider value={{ decorator }}>
                                <Container
                                    form={form}
                                    tabs={tabs}
                                    panels={panels}
                                />
                            </Context.Provider>
                        );

                        // Verify container renders without errors
                        expect(container.firstChild).to.not.be.null;

                        // Verify MUI components are present
                        const muiContainer = container.querySelector(
                            '.MuiContainer-root, .MuiBox-root, .MuiPaper-root'
                        );
                        expect(muiContainer).to.not.be.null;
                    });
                });
            });
        });
    });

    it('with title and description', function () {
        form = { ...form, title, description };
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Container form={form} tabs={tabs} panels={panels} />
            </Context.Provider>
        );

        // Verify container renders with title and description
        expect(container.firstChild).to.not.be.null;

        // Verify title is rendered
        const titleElement = getByText(container, title);
        expect(titleElement).to.not.be.null;

        // Verify description is rendered
        const descElement = getByText(container, description);
        expect(descElement).to.not.be.null;
    });

    it('with title and no description', function () {
        form = { ...form, title };
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Container form={form} tabs={tabs} panels={panels} />
            </Context.Provider>
        );

        // Verify container renders with title but no description
        expect(container.firstChild).to.not.be.null;

        // Verify title is rendered
        const titleElement = getByText(container, title);
        expect(titleElement).to.not.be.null;
    });

    it('with description and no title', function () {
        form = { ...form, description };
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Container form={form} tabs={tabs} panels={panels} />
            </Context.Provider>
        );

        // Verify container renders with description but no title
        expect(container.firstChild).to.not.be.null;

        // Verify description is rendered
        const descElement = container.querySelector(
            'p, [data-testid*="description"], .MuiTypography-body1, .MuiTypography-body2'
        );
        expect(descElement).to.not.be.null;
    });

    it('with no title or description', function () {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Container form={form} tabs={tabs} panels={panels}></Container>
            </Context.Provider>
        );

        // Verify container renders without title or description
        expect(container.firstChild).to.not.be.null;

        // Verify basic container structure is present
        const containerElement = container.querySelector(
            '.MuiContainer-root, .MuiBox-root, .MuiPaper-root'
        );
        expect(containerElement).to.not.be.null;
    });
});
