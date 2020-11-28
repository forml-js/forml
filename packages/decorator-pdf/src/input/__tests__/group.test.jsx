import Group from "../group";
import Context from "@forml/context";
import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { render } from "@testing-library/react";
import * as decorator from "../";

describe("renders", function() {
  let styles;
  let group;
  let form = { type: "fieldset", items: [] };

  beforeEach(function() {
    group = jest.fn(() => ({ border: "1px solid red" }));
    styles = {
      get group() {
        return group();
      },
    };
  });

  test("without formStyles", function() {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <Group form={form} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
  });

  test("with relevant formStyles", function() {
    form = { type: "checkbox", styles, key: [] };

    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <Group form={form} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
    expect(group).toHaveBeenCalled();
  });
});
