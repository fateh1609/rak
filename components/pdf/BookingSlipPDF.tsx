
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Roboto' },
  header: { borderBottom: '2px solid #D4AF37', paddingBottom: 10, marginBottom: 20 },
  logo: { fontSize: 24, color: '#004B49', fontWeight: 'bold' },
  title: { fontSize: 18, textAlign: 'center', marginVertical: 15, textTransform: 'uppercase' },
  box: { border: '1px solid #E5E7EB', padding: 15, marginVertical: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { fontSize: 10, color: '#666' },
  value: { fontSize: 10, fontWeight: 'bold' },
  total: { marginTop: 20, borderTop: '1px solid #000', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  totalText: { fontSize: 14, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'center', color: '#888' }
});

export const BookingSlipPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>RakOasis</Text>
        <Text style={{ fontSize: 10 }}>Booking Ref: {data.bookingId}</Text>
      </View>

      <Text style={styles.title}>Official Booking Acknowledgment</Text>

      <View style={styles.box}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>Asset Details</Text>
        <View style={styles.row}><Text style={styles.label}>Plot Number:</Text><Text style={styles.value}>{data.plotNo}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Block:</Text><Text style={styles.value}>{data.block}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Type:</Text><Text style={styles.value}>{data.type}</Text></View>
      </View>

      <View style={styles.box}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>Payment Details</Text>
        <View style={styles.row}><Text style={styles.label}>Date:</Text><Text style={styles.value}>{data.date}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Mode:</Text><Text style={styles.value}>{data.mode}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Transaction ID:</Text><Text style={styles.value}>{data.txnId}</Text></View>
      </View>

      <View style={styles.total}>
        <Text style={styles.totalText}>Amount Paid (10%):</Text>
        <Text style={styles.totalText}>{data.amount}</Text>
      </View>

      <Text style={styles.footer}>This is a computer-generated receipt. RakOasis Pvt Ltd.</Text>
    </Page>
  </Document>
);
