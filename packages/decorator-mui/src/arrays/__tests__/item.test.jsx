import Item from "../item";
import Context from "@forml/context";
import React from "react";
import { render } from "@testing-library/react";
import * as decorator from "../../";

describe("renders", function() {
    let form;
    let title = "title";
    let description = "description";

    beforeEach(function() {
        form = { type: "text" };
    });

    test('consistently', function() {
        const { container } = render(
            <Context.Provider>
                <Item form={form} otherProps={{}} />
            </Context.Provider>
        )

        expect(container).toMatchSnapshot();
    })
});
