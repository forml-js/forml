import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { useDecorator } from '@forml/hooks';

const styles = ReactPDF.StyleSheet.create({
    root: {
        margin: '2pt',
        padding: '2pt',
    },
});

export default function Items(props) {
    const { form } = props;

    return (
        <ReactPDF.View style={{ ...styles.root }}>
            {props.children}
        </ReactPDF.View>
    );
}
