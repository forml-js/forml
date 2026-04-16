import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const styles = ReactPDF.StyleSheet.create({
    paper: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        border: '1pt solid black',
        margin: '4pt',
    },
    disableMargin: {
        margin: 0,
    },
    root: { display: 'flex', flex: 1, flexDirection: 'column' },
    header: {
        backgroundColor: '#eeeeee',
        display: 'flex',
        flexDirection: 'column',
        padding: '4pt',
        marginBottom: '4pt',
    },
    title: { fontSize: '12pt', fontWeight: 400 },
    description: { fontSize: '9pt', fontWeight: 200, marginTop: '2pt' },
});

export default function Items(props) {
    const { title, description, form } = props;

    const formStyles = 'styles' in form ? form.styles : {};
    const disableMargin = 'disableMargin' in form ? form.disableMargin : false;

    return (
        <ReactPDF.View
            style={{
                ...styles.paper,
                ...formStyles.paper,
                ...(disableMargin
                    ? { ...styles.disableMargin, ...formStyles.disableMargin }
                    : undefined),
            }}
        >
            <ReactPDF.View style={{ ...styles.root, ...formStyles.root }}>
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
                <ReactPDF.View
                    style={{ ...styles.content, ...formStyles.content }}
                >
                    {props.children}
                </ReactPDF.View>
            </ReactPDF.View>
        </ReactPDF.View>
    );
}
