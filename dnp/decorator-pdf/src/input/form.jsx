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

    const formStyles = 'styles' in form ? form.styles : {};

    return (
        <ReactPDF.View style={{ ...styles.input, ...formStyles.input }}>
            <ReactPDF.Text>{value}</ReactPDF.Text>
        </ReactPDF.View>
    );
}
