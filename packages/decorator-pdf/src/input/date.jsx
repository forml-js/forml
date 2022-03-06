import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { useDecorator } from '@forml/hooks';

const styles = ReactPDF.StyleSheet.create({
    root: {},
    content: {
        border: '1pt solid black',
        margin: '5cm',
        borderBottomWidth: 0,
    },
});

export default function Date(props) {
    const { title, description, form } = props;
    const deco = useDecorator();

    const formStyles = 'styles' in form ? form.styles : {};

    return (
        <ReactPDF.View style={{ ...styles.root, ...formStyles.root }}>
            {(title || description) && (
                <ReactPDF.View
                    style={{ ...styles.header, ...formStyles.header }}
                >
                    {title && <deco.Label form={form}>{title}</deco.Label>}
                    {description && (
                        <deco.Input.Description form={form}>
                            {description}
                        </deco.Input.Description>
                    )}
                </ReactPDF.View>
            )}
            <ReactPDF.Text style={{ ...styles.content, ...formStyles.content }}>
                {props.children}
            </ReactPDF.Text>
        </ReactPDF.View>
    );
}
