import Label from "../label";
import Context from "@forml/context";
import React from "react";
import { render } from "@testing-library/react";
import * as decorator from "../";

describe("renders", function() {
    let form;
    let title = "title";
    let description = "description";

    beforeEach(function() {
        form = { type: "string" };
    });

    test("with no shrink", function() {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Label />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });

    test("with shrink", function() {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Label />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });
});
