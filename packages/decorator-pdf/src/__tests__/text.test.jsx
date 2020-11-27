import Text from "../text";
import Context from "@forml/context";
import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { render } from "@testing-library/react";
import * as decorator from "../";

describe("renders", function () {
  let styles;
  let text;
  let form = { type: "fieldset", items: [] };

  beforeEach(function () {
    text = jest.fn(() => ({ border: "1px solid red" }));
    styles = {
      get text() {
        return text();
      },
    };
  });

  test("without formStyles", function () {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <Text form={form} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
  });
  test("with relevant formStyles", function () {
    form = { type: "help", styles, key: [], description: "description" };

    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <Text form={form} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
    expect(text).toHaveBeenCalled();
  });
});
