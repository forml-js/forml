import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const styles = ReactPDF.StyleSheet.create({
    text: {
        fontSize: '9pt',
        fontWeight: 300,
    },
});

export default function Description(props) {
    return (
        <ReactPDF.View style={styles.text}>
            <ReactPDF.Text />
        </ReactPDF.View>
    );
}
