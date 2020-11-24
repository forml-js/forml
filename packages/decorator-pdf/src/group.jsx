import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { useDecorator } from '@forml/hooks';

const styles = ReactPDF.StyleSheet.create({
    root: {
        margin: '2pt',
        padding: '2pt',
        border: '1pt solid black',
    },
});

export default function Group(props) {
    const { form } = props;

    return (
        <ReactPDF.View style={{ ...styles.root }}>
            {props.children}
        </ReactPDF.View>
    );
}
