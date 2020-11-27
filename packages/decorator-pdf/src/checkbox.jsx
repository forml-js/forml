import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { useDecorator } from "@forml/hooks";

const styles = ReactPDF.StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    display: "inline-flex",
    fontFamily: "Material Icons",
    fontSize: "16pt",
    padding: "4pt 0",
    minWidth: "20pt",
  },
});

export default function Checkbox(props) {
  const deco = useDecorator();

  const { title, description, form, checked } = props;

  const formStyles = "styles" in form ? form.styles : {};

  return (
    <ReactPDF.View style={{ ...styles.root, ...formStyles.root }}>
      <ReactPDF.View style={{ ...styles.header, ...formStyles.header }}>
        <ReactPDF.View style={{ ...styles.icon, ...formStyles.icon }}>
          <ReactPDF.Text>
            {checked ? "check_box" : "check_box_outline_blank"}
          </ReactPDF.Text>
        </ReactPDF.View>
        <deco.Label form={form}>{title}</deco.Label>
      </ReactPDF.View>
      <deco.Input.Description form={form}>{description}</deco.Input.Description>
    </ReactPDF.View>
  );
}
