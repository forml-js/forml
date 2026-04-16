import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const styles = ReactPDF.StyleSheet.create({
    text: {
        fontSize: '9pt',
        fontWeight: 300,
    },
});

export default function Description(props) {
    const { form } = props;

    const formStyles = 'styles' in form ? form.styles : {};

    return (
        <ReactPDF.Text style={{ ...styles.text, ...formStyles.text }}>
            {props.children}
        </ReactPDF.Text>
    );
}
