import { Tab } from '../../src/tabs/index.jsx';
import { ModelContext, RenderingContext } from '@forml/context';
import React from 'react';
import { render } from '@testing-library/react';
import * as decorator from '../../';

function makeWrapper({ modelStore, renderingContext }) {
    return ({ children }) => (
        <RenderingContext.Provider value={renderingContext}>
            <ModelContext.Provider value={modelStore}>
                {children}
            </ModelContext.Provider>
        </RenderingContext.Provider>
    );
}

describe('renders', function () {
    let form;
    let parent;
    let title = 'title';
    let description = 'description';
    let decorator;
    let schema;
    let model;
    let modelStore;
    let wrapper;

    beforeEach(function () {
        form = { type: 'fieldset', items: [{ key: [] }] };
        parent = { type: 'tabs', tabs: [form] };
        decorator = {};
        schema = { type: 'object', properties: { field: { type: 'string' } } };
        model = {};
        modelStore = {};
        wrapper = makeWrapper({ modelStore, renderingContext: { decorator } });
    });

    describe('with form options', function () {
        let fields = {
            icon: ['person', undefined],
            elevation: [0, 1, undefined],
        };

        Object.keys(fields).forEach(function (field) {
            fields[field].forEach(function (value) {
                describe(`${field}`, function () {
                    it(`${value}`, function () {
                        form = { ...form, [field]: value, title, description };
                        const { container, getByText, queryByText } = render(
                            <Tab form={form} parent={parent} />,
                            { wrapper }
                        );

                        // Verify tab renders without errors
                        expect(container.firstChild).to.exist;

                        // Verify MUI ListItem structure is present
                        const listItem =
                            container.querySelector('.MuiListItem-root');
                        expect(listItem).to.not.be.null;
                    });
                    it(`${value} with layout`, function () {
                        parent = { ...parent, layout: 'horizontal' };
                        form = { ...form, [field]: value, title, description };
                        const { container, getByText, queryByText } = render(
                            <Tab form={form} parent={parent} />,
                            { wrapper }
                        );

                        // Verify tab with layout renders without errors
                        expect(container.firstChild).to.exist;

                        // Verify MUI ListItem structure is present
                        const listItem =
                            container.querySelector('.MuiListItem-root');
                        expect(listItem).to.not.be.null;
                    });
                });
            });
        });
    });
});
