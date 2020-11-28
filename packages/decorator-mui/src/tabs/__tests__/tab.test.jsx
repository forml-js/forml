import { Tab } from "../";
import Context from "@forml/context";
import React from "react";
import { render } from "@testing-library/react";
import * as decorator from "../";

describe("renders", function() {
    let form;
    let parent;
    let title = "title";
    let description = "description";

    beforeEach(function() {
        form = { type: 'fieldset', items: [{ key: [] }] };
        parent = { type: 'tabs', tabs: [form] };
    });

    describe("with form options", function() {
        let fields = {
            icon: ['person', undefined],
            elevation: [0, 1, undefined]
        };

        Object.keys(fields).forEach(function(field) {
            fields[field].forEach(function(value) {
                describe(`${field}`, function() {
                    test(`${value}`, function() {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <Context.Provider value={{ decorator }}>
                                <Tab
                                    form={form}
                                    parent={parent}
                                    title={title}
                                    description={description}
                                />
                            </Context.Provider>
                        );

                        expect(container).toMatchSnapshot();
                    });
                    test(`${value} with layout`, function() {
                        parent = { ...parent, layout: 'horizontal' }
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <Context.Provider value={{ decorator }}>
                                <Tab
                                    form={form}
                                    parent={parent}
                                    title={title}
                                    description={description}
                                />
                            </Context.Provider>
                        );

                        expect(container).toMatchSnapshot();
                    });
                });
            });
        });
    });
});
