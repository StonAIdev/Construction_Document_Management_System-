import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import SDSTemplate from '../SDSTemplate';

const PDFView = () => (
  <PDFViewer>
    <SDSTemplate/>
  </PDFViewer>
);

export default PDFView;