import DateComponent from "../date";
import Context from "@forml/context";
import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { render } from "@testing-library/react";
import * as decorator from "../../";

describe("renders", function() {
  let form;
  let schema;
  let title = "title";
  let description = "description";
  let styles;
  let root;
  let header;
  let content;

  beforeEach(function() {
    form = { type: "date" };

    root = jest.fn(() => ({ border: "1pt solid red" }));
    header = jest.fn(() => ({ border: "1pt solid red" }));
    content = jest.fn(() => ({ border: "1pt solid red" }));

    styles = {
      get root() {
        return root();
      },
      get header() {
        return header();
      },
      get content() {
        return content();
      },
    };
  });

  test("with title and description", function() {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <DateComponent form={form} title={title} description={description} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
  });

  test("with title and no description", function() {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <DateComponent form={form} title={title} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
  });

  test("with description and no title", function() {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <DateComponent form={form} description={title} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
  });

  test("with no title or description", function() {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <DateComponent form={form} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
  });

  test("with relevant formStyles", function() {
    form = { ...form, styles };
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <DateComponent form={form} title={title} description={description} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
    expect(root).toHaveBeenCalled();
    expect(header).toHaveBeenCalled();
    expect(content).toHaveBeenCalled();
  });
});
