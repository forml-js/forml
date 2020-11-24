import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const styles = ReactPDF.StyleSheet.create({
    content: {
        border: '1pt solid black',
        margin: '5cm',
        borderBottomWidth: 0,
    },
});

export default function Date(props) {
    const { title, description } = props;
    return (
        <ReactPDF.View style={styles.container}>
            {(title || description) && (
                <ReactPDF.View style="header">
                    {title && (
                        <ReactPDF.Text style={styles.title}>
                            {title}
                        </ReactPDF.Text>
                    )}
                    {description && (
                        <ReactPDF.Text style={styles.description}>
                            {description}
                        </ReactPDF.Text>
                    )}
                </ReactPDF.View>
            )}
            <ReactPDF.Text style={styles.content}>
                {props.children}
            </ReactPDF.Text>
        </ReactPDF.View>
    );
}
