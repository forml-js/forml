import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const styles = ReactPDF.StyleSheet.create({
    paper: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        margin: '4pt',
        border: '1pt solid black',
        padding: 0,
    },
    header: {
        padding: '4pt',
        backgroundColor: '#EEEEEE',
    },
    root: {
        display: 'flex',
        flex: 1,
    },
    content: {
        padding: '4pt',
    },
    vertical: {
        flexDirection: 'column',
    },
    horizontal: {
        flexDirection: 'row',
    },
    disablePadding: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    disableGutters: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    disableMargin: {
        margin: 0,
    },
    title: { fontFamily: 'Roboto', fontSize: '12pt', fontWeight: 400 },
    description: {
        fontFamily: 'Roboto',
        fontSize: '9pt',
        fontWeight: 200,
        paddingTop: '2pt',
    },
});

export default function FieldSet(props) {
    const { title, description, form } = props;
    let { styles: formStyles } = form;

    const layout = 'layout' in form ? form.layout : 'vertical';
    const disableGutters =
        'disableGutters' in form ? form.disableGutters : false;
    const disablePadding =
        'disablePadding' in form ? form.disablePadding : false;
    const disableMargin = 'disableMargin' in form ? form.disableMargin : false;
    const wrap = 'wrap' in form ? form.wrap : true;
    const brk = 'break' in form ? form.break : false;

    if (!formStyles) formStyles = {};

    let content = (
        <ReactPDF.View
            break={!title && !description && brk}
            style={{
                ...styles.root,
                ...formStyles.root,
            }}
        >
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
                wrap={wrap}
                style={{
                    ...styles.content,
                    ...formStyles.content,
                    ...styles[layout],
                    ...formStyles[layout],
                    ...(disablePadding
                        ? {
                              ...styles.disablePadding,
                              ...formStyles.disablePadding,
                          }
                        : undefined),
                    ...(disableGutters
                        ? {
                              ...styles.disableGutters,
                              ...formStyles.disableGutters,
                          }
                        : undefined),
                }}
            >
                {props.children}
            </ReactPDF.View>
        </ReactPDF.View>
    );

    if (title || description) {
        content = (
            <ReactPDF.View
                wrap={true}
                style={{
                    ...styles.paper,
                    ...formStyles.paper,
                    ...(disableMargin
                        ? {
                              ...styles.disableMargin,
                              ...formStyles.disableMargin,
                          }
                        : undefined),
                }}
            >
                {content}
            </ReactPDF.View>
        );
    }

    return content;
}
