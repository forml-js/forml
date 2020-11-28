import GroupComponent from "../group";
import React from "react";
import { render } from "@testing-library/react";

describe("renders", function() {
    let form;

    beforeEach(function() {
        form = { type: "text" };
    });

    test('consistently', function() {
        const { container } = render(
            <GroupComponent form={form} />
        )

        expect(container).toMatchSnapshot();
    })
});
