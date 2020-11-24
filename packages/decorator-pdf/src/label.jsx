import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const styles = ReactPDF.StyleSheet.create({
    label: {
        fontSize: '10pt',
        fontWeight: 'bold',
        paddingTop: '4pt',
        marginBottom: '2pt',
    },
});

export default function Label(props) {
    return <ReactPDF.Text style={styles.label}>{props.children}</ReactPDF.Text>;
}
