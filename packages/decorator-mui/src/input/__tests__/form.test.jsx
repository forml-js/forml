import FormComponent from "../form";
import React from "react";
import { render } from "@testing-library/react";

describe("renders", function() {
    let form;

    beforeEach(function() {
        form = { type: "text" };
    });

    test('consistently', function() {
        const { container } = render(
            <FormComponent form={form} />
        )

        expect(container).toMatchSnapshot();
    })
});
