import Description from "../description";
import Context from "@forml/context";
import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { render } from "@testing-library/react";
import * as decorator from "../../";

describe("renders", function() {
    let form;

    beforeEach(function() {
        form = { type: "fieldset", description: "description" };
    });

    test("with description", function() {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Description form={form}>{form.description}</Description>
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
        expect(container.textContent).toBe('description');
    });
});
