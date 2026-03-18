import './globals.css';

export const metadata = {
  title: 'MedNorm AI — Clinical Data Normalization Engine | Team LegacyCoderz',
  description:
    'AI-Powered Clinical Data Normalization Engine for Indian hospitals. Extracts ICD-10-CM, CPT, RxNorm & LOINC codes from unstructured documents and generates HL7 FHIR R4 bundles for billing & insurance. HackMatrix 2.0 × Jilo Health — Team LegacyCoderz.',
  keywords: [
    'MedNorm AI', 'clinical data normalization', 'FHIR R4', 'ICD-10', 'CPT codes',
    'RxNorm', 'LOINC', 'hospital billing', 'Indian healthcare', 'HackMatrix',
    'LegacyCoderz', 'Jilo Health', 'GPT-4 medical', 'clinical NLP',
  ],
  authors: [{ name: 'Team LegacyCoderz' }],
  openGraph: {
    title: 'MedNorm AI — Clinical Data Normalization Engine',
    description:
      'Upload Indian hospital documents. Get ICD-10, CPT, RxNorm & LOINC codes + FHIR R4 bundles in seconds.',
    type: 'website',
    siteName: 'MedNorm AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedNorm AI — Clinical Data Normalization Engine',
    description: 'AI-powered normalization for Indian healthcare documents. HackMatrix 2.0 × Jilo Health.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ backgroundColor: '#060e1e' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ backgroundColor: '#060e1e', color: '#f1f5f9', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}

