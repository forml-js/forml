import "@testing-library/jest-dom/extend-expect";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { render } from "@testing-library/react";
import { SchemaForm, util } from "@forml/core";
import { createElement as h } from "react";
import * as mui from "../";

describe("Material UI", function () {
  describe("with no model", function () {
    const tests = [
      ["root string", { type: "string" }],
      ["root number", { type: "number" }],
      ["root integer", { type: "integer" }],
      ["root date", { type: "string", format: "date" }],
      ["root date-time", { type: "string", format: "date-time" }],
      ["root enumeration", { type: "string", enum: ["a", "b", "c"] }],
      [
        "root multiselect",
        {
          type: "array",
          items: { type: "string", enum: ["a", "b", "c"] },
          uniqueItems: true,
        },
      ],
      //[
      //    'root tuple',
      //    { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
      //],
      //['root array', { type: 'array', items: { type: 'string' } }],
      [
        "root object",
        {
          type: "object",
          properties: {
            test: { type: "string" },
            nested: {
              type: "object",
              properties: {
                property: { type: "number" },
              },
            },
          },
        },
      ],
    ];

    const form = ["*"];
    const decorator = mui;

    for (let [name, schema] of tests) {
      test(`renders empty ${name} consistently`, function () {
        const model = util.defaultForSchema(schema);
        const { container } = render(
          h(
            MuiPickersUtilsProvider,
            { utils: MomentUtils },
            h(SchemaForm, { schema, form, model, decorator })
          )
        );

        expect(container).toMatchSnapshot();
      });
    }
  });
});
