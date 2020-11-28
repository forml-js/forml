import Item from "../item";
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
  let itemRoot;

  beforeEach(function() {
    schema = { type: "string" };
    form = { type: "item", items: [{ key: [] }] };
    itemRoot = jest.fn(() => ({ border: "1px solid red" }));
    styles = {
      get itemRoot() {
        return itemRoot();
      },
    };
  });

  describe("with form options", function() {
    let fields = {
      wrap: [true, false],
    };

    Object.keys(fields).forEach(function(field) {
      fields[field].forEach(function(value) {
        describe(`${field}`, function() {
          test(`${value}`, function() {
            form = { ...form, [field]: value };
            const { container } = render(
              <ReactPDF.Page>
                <Context.Provider value={{ decorator }}>
                  <Item form={form} title={title} description={description} />
                </Context.Provider>
              </ReactPDF.Page>
            );

            expect(container).toMatchSnapshot();
          });
        });
      });
    });
  });

  test("with title and description", function() {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <Item form={form} title={title} description={description} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
  });

  test("with title and no description", function() {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <Item form={form} title={title} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
  });

  test("with description and no title", function() {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <Item form={form} description={title} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
  });

  test("with no title or description", function() {
    const { container } = render(
      <ReactPDF.Page>
        <Context.Provider value={{ decorator }}>
          <Item form={form} />
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
          <Item form={form} />
        </Context.Provider>
      </ReactPDF.Page>
    );

    expect(container).toMatchSnapshot();
    expect(itemRoot).toHaveBeenCalled();
  });
});
