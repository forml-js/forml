import React from 'react';
import ReactPDF from '@react-pdf/renderer';

export default function Description(props) {
    const styles = {
        description: {
            marginTop: '2pt',
            fontSize: '9pt',
            color: 'rgba(0, 0, 0, 0.54)',
        },
    };

    return (
        <ReactPDF.View style={styles.description}>
            <ReactPDF.Text>{props.children}</ReactPDF.Text>
        </ReactPDF.View>
    );
}
