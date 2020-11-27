import React from "react";
import ReactPDF from "@react-pdf/renderer";

const styles = ReactPDF.StyleSheet.create({
  title: {
    fontSize: "10pt",
    fontWeight: "bold",
    paddingTop: "4pt",
    marginBottom: "2pt",
  },
});

export default function Label(props) {
  const { form } = props;

  const formStyles = "styles" in form ? form.styles : {};

  return (
    <ReactPDF.Text style={{ ...styles.title, ...formStyles.title }}>
      {props.children}
    </ReactPDF.Text>
  );
}
