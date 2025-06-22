import { it, describe } from 'mocha';
import { expect } from 'chai';
import { Panel } from '../../src/tabs/index.jsx';
import Context from '@forml/context';
import React from 'react';
import { render } from '@testing-library/react';
import * as decorator from '../../';

describe('renders', function () {
    let form;
    let parent;
    let title = 'title';
    let description = 'description';

    beforeEach(function () {
        form = { type: 'fieldset', items: [{ key: [] }] };
        parent = { type: 'tabs', tabs: [form] };
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
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <Context.Provider value={{ decorator }}>
                                <Panel
                                    form={form}
                                    parent={parent}
                                    title={title}
                                    description={description}
                                />
                            </Context.Provider>
                        );

                        // Verify panel renders without errors
                        expect(container.firstChild).to.not.be.null;
                        
                        // Verify MUI panel components are present
                        const panelElement = container.querySelector('.MuiPaper-root, .MuiBox-root, .MuiContainer-root');
                        expect(panelElement).to.not.be.null;
                    });
                    it(`${value} with layout`, function () {
                        parent = { ...parent, layout: 'horizontal' };
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <Context.Provider value={{ decorator }}>
                                <Panel
                                    form={form}
                                    parent={parent}
                                    title={title}
                                    description={description}
                                />
                            </Context.Provider>
                        );

                        // Verify panel with layout renders without errors
                        expect(container.firstChild).to.not.be.null;
                        
                        // Verify MUI panel components are present
                        const panelElement = container.querySelector('.MuiPaper-root, .MuiBox-root, .MuiContainer-root');
                        expect(panelElement).to.not.be.null;
                    });
                });
            });
        });
    });
});
