import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a clean font
// Register a clean font (Disabled for diagnostic)
// Font.register({
//   family: 'Inter',
//   fonts: [
//     { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
//     { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 700 },
//   ],
// });

const styles = StyleSheet.create({
  page: { padding: 50, backgroundColor: '#FFFFFF' },
  header: { marginBottom: 30, borderBottom: '2pt solid #000', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 },
  subtitle: { fontSize: 10, color: '#666', marginTop: 5 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', color: '#000' },
  text: { fontSize: 9, lineHeight: 1.5, color: '#333', textAlign: 'justify' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  gridItem: { width: '45%' },
  label: { fontSize: 8, color: '#999', textTransform: 'uppercase', marginBottom: 2 },
  value: { fontSize: 10, fontWeight: 700 },
  signatureSection: { marginTop: 50, flexDirection: 'row', justifyContent: 'space-between' },
  signatureBox: { width: '45%', borderTop: '1pt solid #000', paddingTop: 10 },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, borderTop: '0.5pt solid #EEE', paddingTop: 10, fontSize: 7, color: '#AAA', textAlign: 'center' }
});

export const AgreementPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>GrowXLabsTech</Text>
        <Text style={styles.subtitle}>Master Service Agreement & Project Charter</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Service Provider</Text>
          <Text style={styles.value}>GrowXLabsTech Engineering</Text>
          <Text style={styles.text}>contact@growxlabs.tech</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Client</Text>
          <Text style={styles.value}>{data.client_name || "Valued Client"}</Text>
          <Text style={styles.text}>{data.business_name || "Direct Partnership"}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Scope of Work</Text>
        <Text style={styles.text}>{data.project_description || "As discussed in the technical discovery phase."}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Payment Terms</Text>
        <Text style={styles.text}>
          Total Project Fee: ${data.total_value || "0.00"}. An advance payment of ${data.advance || "0.00"} is required to initiate the project. 
          The balance of ${data.balance || "0.00"} shall be payable upon delivery of the final milestone.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Revision Policy</Text>
        <Text style={styles.text}>
          The client is entitled to two (2) rounds of major revisions. Additional revisions will be billed at our standard hourly rate.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Timeline</Text>
        <Text style={styles.text}>
          Project Commencement: {data.start_date || "Upon Signature"}. Expected Delivery: {data.delivery_date || "To be confirmed"}.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Intellectual Property Ownership</Text>
        <Text style={styles.text}>
          Upon final payment, all custom code, designs, and assets created specifically for this project shall be the sole property of the Client.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Termination</Text>
        <Text style={styles.text}>
          Either party may terminate this agreement with 14 days written notice. In the event of termination, the Client shall pay for all work completed up to the termination date.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Confidentiality</Text>
        <Text style={styles.text}>
          Both parties agree to keep all proprietary information, trade secrets, and non-public data strictly confidential during and after the contract term.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Liability</Text>
        <Text style={styles.text}>
          GrowXLabsTech shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the delivered products.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. Support & Maintenance</Text>
        <Text style={styles.text}>
          Includes 30 days of post-launch technical support for critical bug fixes. Extended maintenance contracts are available separately.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>10. Third-Party Disclaimer</Text>
        <Text style={styles.text}>
          GrowXLabsTech is not responsible for the performance or uptime of third-party services (e.g., AWS, OpenAI, Razorpay) used within the project.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>11. Force Majeure</Text>
        <Text style={styles.text}>
          Neither party shall be liable for failure to perform due to circumstances beyond their reasonable control, including acts of God, war, or infrastructure failure.
        </Text>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          <Text style={styles.label}>For GrowXLabsTech</Text>
          <Text style={styles.value}>Authorized Signatory</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text style={styles.label}>For {data.business_name || "Client"}</Text>
          <Text style={styles.value}>Client Signature Block</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        GrowXLabsTech Engineering | Confidential Document | Generated on {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

export const InvoicePDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Text style={styles.subtitle}>GrowXLabsTech Internal Billing System</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.value}>GrowXLabsTech</Text>
          <Text style={styles.text}>Engineering HQ</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={styles.value}>{data.client_name}</Text>
          <Text style={styles.text}>{data.business_name}</Text>
        </View>
      </View>

      <View style={{ marginVertical: 30, borderBottom: '1pt solid #EEE', paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', borderBottom: '1pt solid #000', paddingBottom: 5, marginBottom: 10 }}>
          <Text style={{ flex: 2, fontSize: 10, fontWeight: 700 }}>Description</Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: 700, textAlign: 'right' }}>Amount</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 2, fontSize: 10 }}>{data.description}</Text>
          <Text style={{ flex: 1, fontSize: 10, textAlign: 'right' }}>${data.amount}</Text>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <View style={{ width: '40%', borderTop: '2pt solid #000', paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={{ fontSize: 10, color: '#666' }}>Subtotal</Text>
            <Text style={{ fontSize: 10 }}>${data.amount}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>TOTAL DUE</Text>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>${data.amount}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 50 }}>
        <Text style={styles.label}>Payment Note</Text>
        <Text style={styles.text}>
          Please complete payment within 7 days using the secure Razorpay link provided in the portal. 
          Status will be automatically updated upon successful transaction.
        </Text>
      </View>

      <Text style={styles.footer}>
        Invoice ID: {data.invoice_id} | Issued via GrowX Secure Portal
      </Text>
    </Page>
  </Document>
);
