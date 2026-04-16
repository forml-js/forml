import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const styles = ReactPDF.StyleSheet.create({
    root: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
});

export default function Item(props) {
    const { form, title, description } = props;

    const formStyles = 'styles' in form ? form.styles : {};
    const wrap = 'wrap' in form ? form.wrap : false;

    return (
        <ReactPDF.View
            wrap={wrap}
            style={{ ...styles.root, ...formStyles.itemRoot }}
        >
            {props.children}
        </ReactPDF.View>
    );
}
