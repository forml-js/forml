import React from 'react';
import ReactPDF from '@react-pdf/renderer';
const styles = ReactPDF.StyleSheet.create({
    header: {},
});
export default function Panel(props) {
    const { title, description, form } = props;

    const size = 'size' in form ? form.size : 'A4';
    const formStyles = 'styles' in form ? form.styles : {};

    return (
        <ReactPDF.Page size="A4">
            {(title || description) && (
                <ReactPDF.View
                    fixed
                    style={{ ...styles.header, ...formStyles.header }}
                >
                    {title && (
                        <ReactPDF.Text
                            style={{ ...styles.title, ...formStyles.title }}
                        >
                            {title}
                        </ReactPDF.Text>
                    )}
                    {description && (
                        <ReactPDF.Text
                            style={{
                                ...styles.description,
                                ...formStyles.description,
                            }}
                        >
                            {description}
                        </ReactPDF.Text>
                    )}
                </ReactPDF.View>
            )}
            <ReactPDF.View style={{ ...styles.content, ...formStyles.content }}>
                {props.children}
            </ReactPDF.View>
        </ReactPDF.Page>
    );
}
