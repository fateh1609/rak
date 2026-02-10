
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Roboto' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  brand: { fontSize: 20, color: '#004B49', fontWeight: 'bold' },
  subHeader: { fontSize: 10, color: '#666' },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf' },
  tableRow: { margin: 'auto', flexDirection: 'row', width: '100%' },
  tableColHeader: { width: '50%', borderStyle: 'solid', borderWidth: 1, backgroundColor: '#f0f0f0', padding: 5 },
  tableCol: { width: '50%', borderStyle: 'solid', borderWidth: 1, padding: 5 },
  cell: { fontSize: 10 },
  statusSuccess: { color: 'green', fontWeight: 'bold', fontSize: 12, marginTop: 10 }
});

export const EMISlipPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A5" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>RakOasis</Text>
          <Text style={styles.subHeader}>Payment Receipt</Text>
        </View>
        <View>
          <Text style={styles.subHeader}>Date: {data.date}</Text>
          <Text style={styles.subHeader}>Receipt #: {data.receiptNo}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.cell}>Description</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.cell}>Details</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.cell}>Installment No.</Text></View>
          <View style={styles.tableCol}><Text style={styles.cell}>{data.installmentNumber} of 60</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.cell}>Paid By</Text></View>
          <View style={styles.tableCol}><Text style={styles.cell}>{data.clientName}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.cell}>Reference (UTR)</Text></View>
          <View style={styles.tableCol}><Text style={styles.cell}>{data.utr}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={{ ...styles.cell, fontWeight: 'bold' }}>Amount Paid</Text></View>
          <View style={styles.tableCol}><Text style={{ ...styles.cell, fontWeight: 'bold' }}>{data.amount}</Text></View>
        </View>
      </View>

      <Text style={styles.statusSuccess}>✅ PAYMENT SUCCESSFUL</Text>
      <Text style={{ fontSize: 8, marginTop: 20, color: '#999' }}>Generated via RakOasis Client Portal</Text>
    </Page>
  </Document>
);
