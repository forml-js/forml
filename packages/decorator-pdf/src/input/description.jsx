import React from 'react';
import ReactPDF from '@react-pdf/renderer';

export default function Description(props) {
    const { form } = props;
    const styles = {
        description: {
            marginTop: '2pt',
            fontSize: '9pt',
            color: 'rgba(0, 0, 0, 0.54)',
        },
    };

    const formStyles = 'styles' in form ? form.styles : {};

    return (
        <ReactPDF.View
            style={{ ...styles.description, ...formStyles.description }}
        >
            <ReactPDF.Text>{props.children}</ReactPDF.Text>
        </ReactPDF.View>
    );
}
