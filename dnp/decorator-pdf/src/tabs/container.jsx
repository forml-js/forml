import React from 'react';
import ReactPDF from '@react-pdf/renderer';

export default function Container(props) {
    return <ReactPDF.Document>{props.panels}</ReactPDF.Document>;
}
