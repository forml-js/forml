import ArrayComponent from "../items";
import Context from "@forml/context";
import React from "react";
import { render } from "@testing-library/react";
import * as decorator from "../";

describe("renders", function() {
    let form;
    let title = "title";
    let description = "description";
    let localizer;

    beforeEach(function() {
        form = { type: "array", items: [{ key: [] }] };
        localizer = { getLocalizedString: jest.fn(id => id) };
    });

    describe("with form options", function() {
        let fields = {
            disableGutters: [true, false],
            disablePadding: [true, false],
            icon: ['person', 'favorite']
        };

        Object.keys(fields).forEach(function(field) {
            fields[field].forEach(function(value) {
                describe(`${field}`, function() {
                    test(`${value}`, function() {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <Context.Provider value={{ decorator, localizer }}>
                                <ArrayComponent
                                    form={form}
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

    test("with title and description", function() {
        const { container } = render(
            <Context.Provider value={{ decorator, localizer }}>
                <ArrayComponent form={form} title={title} description={description} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test("with title and no description", function() {
        const { container } = render(
            <Context.Provider value={{ decorator, localizer }}>
                <ArrayComponent form={form} title={title} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test("with description and no title", function() {
        const { container } = render(
            <Context.Provider value={{ decorator, localizer }}>
                <ArrayComponent form={form} description={title} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test("with no title or description", function() {
        const { container } = render(
            <Context.Provider value={{ decorator, localizer }}>
                <ArrayComponent form={form} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });
});
