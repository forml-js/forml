import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const styles = ReactPDF.StyleSheet.create({
    input: {
        minHeight: '14pt',
        fontFamily: 'Roboto',
        borderBottom: '1pt solid black',
        fontSize: '10pt',
        flex: 1,
        padding: '2pt',
    },
});

export default function Form(props) {
    const { form, value } = props;
    let { styles: formStyles } = form;

    if (!formStyles) formStyles = {};

    return <ReactPDF.Text style={styles.input}>{value}</ReactPDF.Text>;
}
