import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import SDSTemplate from '../SDSTemplate';
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const MyDoc = () => (
    <SDSTemplate name={"Saad"} age={24}/>
);


function PdfDocument() {
  return (
    <div className="App">
      <PDFDownloadLink document={<MyDoc />} fileName="somename.pdf">
      {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink>
    </div>
  );
}

export default PdfDocument;