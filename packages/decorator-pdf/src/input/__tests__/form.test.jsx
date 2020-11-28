import Form from "../form";
import Context from "@forml/context";
import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { render } from "@testing-library/react";
import * as decorator from "../../";

describe("renders", function() {
    let form;
    let styles;
    let input;
    let value;

    beforeEach(function() {
        form = { type: "string" };

        input = jest.fn(() => ({ border: "1pt solid red" }));

        styles = {
            get input() {
                return input();
            },
        };
    });

    test("with relevant formStyles", function() {
        form = { ...form, styles };
        const { container } = render(
            <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                    <Form form={form} value={value} />
                </Context.Provider>
            </ReactPDF.Page>
        );

        expect(container).toMatchSnapshot();
        expect(input).toHaveBeenCalled();
    });
});
