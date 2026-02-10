
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Roboto' },
  header: { borderBottom: '1px solid #E5E7EB', paddingBottom: 15, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 20, color: '#0F172A', fontWeight: 'bold' },
  subBrand: { fontSize: 10, color: '#C5A028', letterSpacing: 1 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#0F172A', textTransform: 'uppercase' },
  meta: { fontSize: 10, color: '#64748B', marginBottom: 20 },
  content: { fontSize: 11, marginBottom: 12, lineHeight: 1.6, color: '#334155', textAlign: 'justify' },
  highlight: { backgroundColor: '#F1F5F9', padding: 10, marginVertical: 10, borderRadius: 4 },
  highlightText: { fontSize: 10, fontWeight: 'bold', color: '#0F172A' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'center', color: '#94A3B8', borderTop: '1px solid #E5E7EB', paddingTop: 10 }
});

export const GenericDocumentPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
            <Text style={styles.brand}>RAK OASIS</Text>
            <Text style={styles.subBrand}>PREMIUM ESTATE</Text>
        </View>
        <Text style={{ fontSize: 9, color: '#64748B' }}>Ref: {data.ref}</Text>
      </View>

      {/* Body */}
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.meta}>Date: {data.date}  |  Status: {data.status}</Text>
      
      <Text style={styles.content}>
        This document serves as the official {data.type} for the property located at Plot {data.plot || 'A-105'}, Block A, RAK Oasis Estate, Ras Al Khaimah.
      </Text>

      <View style={styles.highlight}>
        <Text style={styles.highlightText}>
          Property Reference: {data.plot || 'A-105'}
        </Text>
        <Text style={styles.highlightText}>
          Registered Owner: {data.owner || 'Amit Sharma'}
        </Text>
      </View>

      <Text style={styles.content}>
        This is a digitally generated copy of the {data.title}. In a production environment, this PDF would contain the full legal text, specific clauses, terms of service, and verified digital signatures relevant to the transaction.
      </Text>
      
      <Text style={styles.content}>
        The content herein is for demonstration purposes to showcase the document generation capabilities of the RAK Oasis Client Portal.
      </Text>

      <Text style={styles.content}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </Text>
      
      {/* Signature Section */}
      <View style={{ marginTop: 60, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Authorized Signatory</Text>
            <Text style={{ fontSize: 10, marginTop: 30, color: '#CBD5E1' }}>_________________________</Text>
            <Text style={{ fontSize: 9, marginTop: 5, color: '#64748B' }}>RAK Oasis Management</Text>
        </View>
        <View>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Client Signature</Text>
            <Text style={{ fontSize: 10, marginTop: 30, color: '#CBD5E1' }}>_________________________</Text>
            <Text style={{ fontSize: 9, marginTop: 5, color: '#64748B' }}>Digitally Signed</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        RAK Oasis Estate | Ras Al Khaimah, UAE | Support: +971 4 000 0000 | www.rakoasis.com
      </Text>
    </Page>
  </Document>
);
