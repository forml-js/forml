import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { useDecorator } from '@forml/hooks';

const styles = ReactPDF.StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Roboto',
        display: 'inline-flex',
        flexDirection: 'row',
        flex: 0,
        fontSize: '10pt',
        fontWeight: 400,
    },
    description: {
        fontFamily: 'Roboto',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '8pt',
        fontWeight: 300,
    },
    icon: {
        display: 'inline-flex',
        fontFamily: 'Material Icons',
        fontSize: '16pt',
        padding: '4pt 0',
        minWidth: '20pt',
    },
});

export default function Checkbox(props) {
    const deco = useDecorator();

    const { title, description, form, checked } = props;
    let { styles: formStyles } = form;

    if (!formStyles) formStyles = {};

    return (
        <ReactPDF.View style={{ ...styles.root, ...formStyles.root }}>
            <ReactPDF.View style={{ ...styles.header, ...formStyles.header }}>
                <ReactPDF.View style={{ ...styles.icon, ...formStyles.icon }}>
                    <ReactPDF.Text>
                        {checked ? 'check_box' : 'check_box_outline_blank'}
                    </ReactPDF.Text>
                </ReactPDF.View>
                <ReactPDF.Text style={{ ...styles.title, ...formStyles.title }}>
                    {title}
                </ReactPDF.Text>
            </ReactPDF.View>
            <ReactPDF.Text
                style={{ ...styles.description, ...formStyles.description }}
            >
                {description}
            </ReactPDF.Text>
        </ReactPDF.View>
    );
}
