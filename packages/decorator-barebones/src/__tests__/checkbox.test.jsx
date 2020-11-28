import Checkbox from "../checkbox";
import Context from "@forml/context";
import React from "react";
import { render } from "@testing-library/react";
import * as decorator from "../";

describe("renders", function() {
    let form;
    let title = "title";
    let description = "description";
    let styles;
    let root;
    let header;
    let icon;

    beforeEach(function() {
        form = { type: "checkbox", key: [] };
    });

    test("with no title or description", function() {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Checkbox form={form} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test("with title but no description", function() {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Checkbox form={form} title={title} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test("when checked", function() {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Checkbox
                    form={form}
                    title={title}
                    description={description}
                    checked={true}
                />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });
});
