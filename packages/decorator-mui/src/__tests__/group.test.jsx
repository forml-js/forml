import Group from "../group";
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

    describe("with form options", function() {
        let fields = {
            fullWidth: [true, false],
        };

        Object.keys(fields).forEach(function(field) {
            fields[field].forEach(function(value) {
                describe(`${field}`, function() {
                    test(`${value}`, function() {
                        form = { ...form, [field]: value };
                        const { container } = render(
                            <Context.Provider value={{ decorator }}>
                                <Group
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

    test("with no title or description", function() {
        const { container } = render(
            <Context.Provider value={{ decorator }}>
                <Group form={form} />
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
    });
});
