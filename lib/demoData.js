// ─── Demo Data for MedNorm AI (Track 2) ───────────────────────────────────────
// 3 realistic Indian healthcare documents: Lab Report, Hospital Bill, Discharge Summary

export const demoRecords = [
  {
    id: 'rec_001',
    title: 'CBC + Metabolic Panel — Lab Report',
    type: 'lab_report',
    patient: {
      name: 'Rajesh Kumar',
      age: 42,
      gender: 'Male',
      dob: '1982-03-15',
      uhid: 'AIIMS-2024-08731',
      phone: '+91-9876543210',
      address: 'H-12, Sector 5, Rohini, New Delhi - 110085',
    },
    document: {
      source: 'AIIMS New Delhi Pathology Dept.',
      date: '2025-11-22',
      reportId: 'LAB-2025-44821',
      type: 'Laboratory Report',
      pages: 3,
    },
    status: 'done',
    confidence: 97.4,
    processingTime: '2.3s',
    extracted: {
      diagnoses: [
        { code: 'E11.65', system: 'ICD-10-CM', description: 'Type 2 diabetes mellitus with hyperglycemia', confidence: 0.96 },
        { code: 'D64.9', system: 'ICD-10-CM', description: 'Anaemia, unspecified', confidence: 0.89 },
        { code: 'E78.5', system: 'ICD-10-CM', description: 'Hyperlipidaemia, unspecified', confidence: 0.92 },
      ],
      labValues: [
        { code: '26464-8', system: 'LOINC', name: 'WBC Count', value: '9.2', unit: 'K/uL', refRange: '4.5–11.0', status: 'normal' },
        { code: '718-7', system: 'LOINC', name: 'Hemoglobin', value: '9.8', unit: 'g/dL', refRange: '13.5–17.5', status: 'low' },
        { code: '4544-3', system: 'LOINC', name: 'Hematocrit', value: '31.2', unit: '%', refRange: '41–53', status: 'low' },
        { code: '787-2', system: 'LOINC', name: 'MCV', value: '68.4', unit: 'fL', refRange: '80–100', status: 'low' },
        { code: '2339-0', system: 'LOINC', name: 'Glucose (Fasting)', value: '214', unit: 'mg/dL', refRange: '70–100', status: 'high' },
        { code: '4548-4', system: 'LOINC', name: 'HbA1c', value: '8.7', unit: '%', refRange: '<5.7', status: 'high' },
        { code: '2093-3', system: 'LOINC', name: 'Total Cholesterol', value: '242', unit: 'mg/dL', refRange: '<200', status: 'high' },
        { code: '2571-8', system: 'LOINC', name: 'Triglycerides', value: '318', unit: 'mg/dL', refRange: '<150', status: 'high' },
        { code: '2085-9', system: 'LOINC', name: 'HDL Cholesterol', value: '32', unit: 'mg/dL', refRange: '>40', status: 'low' },
        { code: '13457-7', system: 'LOINC', name: 'LDL Cholesterol', value: '147', unit: 'mg/dL', refRange: '<100', status: 'high' },
        { code: '2160-0', system: 'LOINC', name: 'Creatinine', value: '1.1', unit: 'mg/dL', refRange: '0.7–1.2', status: 'normal' },
        { code: '3094-0', system: 'LOINC', name: 'BUN', value: '18', unit: 'mg/dL', refRange: '7–20', status: 'normal' },
      ],
      medications: [
        { code: '860975', system: 'RxNorm', name: 'Metformin 500mg', dose: '1 tablet BD', route: 'Oral' },
        { code: '83367', system: 'RxNorm', name: 'Atorvastatin 20mg', dose: '1 tablet HS', route: 'Oral' },
        { code: '1049639', system: 'RxNorm', name: 'Ferrous Sulfate 200mg', dose: '1 tablet TDS', route: 'Oral' },
      ],
      procedures: [],
      vitals: [],
    },
    billing: {
      totalCharges: 2850,
      currency: 'INR',
      lineItems: [
        { cpt: '80053', description: 'Comprehensive Metabolic Panel', amount: 1200 },
        { cpt: '85025', description: 'Complete Blood Count w/ Differential', amount: 650 },
        { cpt: '83036', description: 'HbA1c', amount: 450 },
        { cpt: '80061', description: 'Lipid Panel', amount: 550 },
      ],
      payerInfo: { name: 'Star Health Insurance', policyNo: 'SHI-2024-877321', preAuth: 'PA-990123' },
      claimsStatus: 'ready',
    },
    fhir: null, // generated at runtime
  },

  {
    id: 'rec_002',
    title: 'Inpatient Hospital Bill — Knee Replacement',
    type: 'hospital_bill',
    patient: {
      name: 'Sunita Devi',
      age: 62,
      gender: 'Female',
      dob: '1962-07-08',
      uhid: 'FORTIS-2025-19023',
      phone: '+91-9811223344',
      address: '23, Rajpur Road, Dehradun, Uttarakhand - 248001',
    },
    document: {
      source: 'Fortis Hospital, Dehradun',
      date: '2025-12-10',
      reportId: 'BILL-2025-F78341',
      type: 'Inpatient Bill',
      pages: 6,
    },
    status: 'done',
    confidence: 94.1,
    processingTime: '3.8s',
    extracted: {
      diagnoses: [
        { code: 'M17.11', system: 'ICD-10-CM', description: 'Primary osteoarthritis, right knee', confidence: 0.98 },
        { code: 'I10', system: 'ICD-10-CM', description: 'Essential (primary) hypertension', confidence: 0.95 },
        { code: 'Z96.641', system: 'ICD-10-CM', description: 'Presence of right artificial knee joint', confidence: 0.91 },
      ],
      procedures: [
        { code: '27447', system: 'CPT', description: 'Total Knee Arthroplasty', amount: 85000 },
        { code: '27570', system: 'CPT', description: 'Manipulation of knee joint under general anesthesia', amount: 12000 },
        { code: '00400', system: 'CPT', description: 'Anesthesia for procedures on lower extremities', amount: 22000 },
        { code: '73562', system: 'CPT', description: 'X-Ray knee, 3 views (pre-op)', amount: 3500 },
        { code: '71046', system: 'CPT', description: 'Chest X-ray, 2 views (pre-anesthesia)', amount: 1200 },
        { code: '93000', system: 'CPT', description: 'Electrocardiogram, routine ECG', amount: 800 },
      ],
      medications: [
        { code: '1049630', system: 'RxNorm', name: 'Cefazolin 1g IV', dose: 'Pre-op + 24h post-op', route: 'IV' },
        { code: '41493', system: 'RxNorm', name: 'Enoxaparin 40mg', dose: 'OD x 10 days', route: 'SC' },
        { code: '161', system: 'RxNorm', name: 'Acetaminophen 650mg', dose: 'TDS PRN', route: 'Oral' },
        { code: '7052', system: 'RxNorm', name: 'Pantoprazole 40mg', dose: 'OD', route: 'Oral' },
      ],
      labValues: [
        { code: '718-7', system: 'LOINC', name: 'Hemoglobin (pre-op)', value: '11.2', unit: 'g/dL', refRange: '12–16', status: 'low' },
        { code: '6301-6', system: 'LOINC', name: 'PT/INR', value: '1.1', unit: 'ratio', refRange: '0.8–1.2', status: 'normal' },
      ],
      vitals: [
        { name: 'Blood Pressure', value: '148/92', unit: 'mmHg', note: 'Pre-op' },
        { name: 'Heart Rate', value: '74', unit: 'bpm', note: 'Pre-op' },
        { name: 'SpO2', value: '98', unit: '%', note: 'Pre-op, room air' },
      ],
    },
    billing: {
      totalCharges: 312500,
      currency: 'INR',
      lineItems: [
        { cpt: '27447', description: 'Total Knee Arthroplasty (Surgeon)', amount: 85000 },
        { cpt: '00400', description: 'Anesthesia Charges', amount: 22000 },
        { cpt: 'ROOM', description: 'Room & Board (5 days ICU + ward)', amount: 62500 },
        { cpt: 'IMPL', description: 'Knee Implant (NexGen Cruciate Retaining)', amount: 110000 },
        { cpt: 'NURS', description: 'Nursing Charges', amount: 15000 },
        { cpt: 'PHARM', description: 'Pharmacy & Consumables', amount: 9000 },
        { cpt: 'LAB', description: 'Laboratory Investigations', amount: 4800 },
        { cpt: 'RADIO', description: 'Radiology', amount: 4200 },
      ],
      payerInfo: { name: 'CGHS (Central Govt. Health Scheme)', policyNo: 'CGHS-DEH-2019-441', preAuth: 'PA-CGHS-20251189' },
      claimsStatus: 'submitted',
      approvedAmount: 290000,
      deductible: 22500,
    },
    fhir: null,
  },

  {
    id: 'rec_003',
    title: 'Discharge Summary — Acute Gastroenteritis',
    type: 'discharge_summary',
    patient: {
      name: 'Aryan Sharma',
      age: 8,
      gender: 'Male',
      dob: '2016-05-22',
      uhid: 'APOLLO-2025-55490',
      phone: '+91-9944556677',
      address: '7/B, Banjara Hills, Hyderabad, Telangana - 500034',
    },
    document: {
      source: 'Apollo Hospitals, Jubilee Hills, Hyderabad',
      date: '2026-01-18',
      reportId: 'DS-2026-AP-003291',
      type: 'Discharge Summary',
      pages: 4,
    },
    status: 'done',
    confidence: 96.2,
    processingTime: '2.9s',
    extracted: {
      diagnoses: [
        { code: 'A09', system: 'ICD-10-CM', description: 'Infectious gastroenteritis and colitis, unspecified', confidence: 0.97 },
        { code: 'E86.0', system: 'ICD-10-CM', description: 'Dehydration', confidence: 0.99 },
        { code: 'R11.2', system: 'ICD-10-CM', description: 'Nausea with vomiting, unspecified', confidence: 0.93 },
      ],
      medications: [
        { code: '2200644', system: 'RxNorm', name: 'ORS (WHO Formula)', dose: '200mL after each loose stool', route: 'Oral' },
        { code: '309362', system: 'RxNorm', name: 'Zinc Sulphate 20mg', dose: 'OD x 14 days', route: 'Oral' },
        { code: '1049502', system: 'RxNorm', name: 'Ondansetron 2mg syrup', dose: 'TDS PRN', route: 'Oral' },
        { code: '151392', system: 'RxNorm', name: 'Normal Saline 0.9%', dose: '100 mL/hr x 8 hrs (IV)', route: 'IV' },
      ],
      procedures: [
        { code: '99233', system: 'CPT', description: 'Subsequent hospital care, per day', amount: 2500 },
        { code: '36000', system: 'CPT', description: 'IV catheter placement', amount: 800 },
        { code: '90760', system: 'CPT', description: 'IV infusion, hydration, first hour', amount: 1200 },
      ],
      labValues: [
        { code: '2951-2', system: 'LOINC', name: 'Sodium', value: '129', unit: 'mEq/L', refRange: '136–145', status: 'low' },
        { code: '2823-3', system: 'LOINC', name: 'Potassium', value: '3.1', unit: 'mEq/L', refRange: '3.5–5.0', status: 'low' },
        { code: '2160-0', system: 'LOINC', name: 'Creatinine', value: '0.8', unit: 'mg/dL', refRange: '0.3–0.7', status: 'high' },
        { code: '5770-3', system: 'LOINC', name: 'Urine specific gravity', value: '1.028', unit: '', refRange: '1.003–1.030', status: 'normal' },
      ],
      vitals: [
        { name: 'Temperature', value: '38.4', unit: '°C', note: 'Admission' },
        { name: 'Heart Rate', value: '112', unit: 'bpm', note: 'Admission (tachycardia)' },
        { name: 'Blood Pressure', value: '90/60', unit: 'mmHg', note: 'Admission (low)' },
        { name: 'Weight', value: '22', unit: 'kg', note: 'Admission' },
      ],
    },
    billing: {
      totalCharges: 28500,
      currency: 'INR',
      lineItems: [
        { cpt: '99233', description: 'Inpatient Daily Charge (2 days)', amount: 5000 },
        { cpt: 'ROOM', description: 'Paediatric Ward (2 nights)', amount: 8000 },
        { cpt: '90760', description: 'IV Hydration Therapy', amount: 3200 },
        { cpt: 'PHARM', description: 'Medications & Consumables', amount: 4800 },
        { cpt: 'LAB', description: 'Lab Investigations (electrolytes, CBC)', amount: 5200 },
        { cpt: 'NURS', description: 'Nursing & Monitoring', amount: 2300 },
      ],
      payerInfo: { name: 'Niva Bupa Health Insurance', policyNo: 'NB-HYD-2023-102938', preAuth: 'PA-NB-202601029' },
      claimsStatus: 'approved',
      approvedAmount: 27200,
      deductible: 1300,
    },
    fhir: null,
  },
];

// Generate a basic FHIR R4 bundle from record data
export function generateFHIRBundle(record) {
  const now = new Date().toISOString();
  const patientId = `patient-${record.id}`;

  const patient = {
    resourceType: 'Patient',
    id: patientId,
    identifier: [{ system: 'https://hospital.in/uhid', value: record.patient.uhid }],
    name: [{ text: record.patient.name, use: 'official' }],
    gender: record.patient.gender.toLowerCase(),
    birthDate: record.patient.dob,
    telecom: [{ system: 'phone', value: record.patient.phone }],
    address: [{ text: record.patient.address }],
  };

  const encounter = {
    resourceType: 'Encounter',
    id: `encounter-${record.id}`,
    status: 'finished',
    class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: record.type === 'lab_report' ? 'AMB' : 'IMP' },
    subject: { reference: `Patient/${patientId}` },
    serviceProvider: { display: record.document.source },
    period: { start: record.document.date },
  };

  const conditions = record.extracted.diagnoses.map((d, i) => ({
    resourceType: 'Condition',
    id: `condition-${record.id}-${i}`,
    code: {
      coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: d.code, display: d.description }],
      text: d.description,
    },
    subject: { reference: `Patient/${patientId}` },
    encounter: { reference: `Encounter/encounter-${record.id}` },
    verificationStatus: { coding: [{ code: 'confirmed' }] },
  }));

  const medications = record.extracted.medications.map((m, i) => ({
    resourceType: 'MedicationRequest',
    id: `medrec-${record.id}-${i}`,
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: m.code, display: m.name }],
      text: m.name,
    },
    subject: { reference: `Patient/${patientId}` },
    dosageInstruction: [{ text: `${m.dose} (${m.route})` }],
  }));

  const observations = record.extracted.labValues.map((l, i) => ({
    resourceType: 'Observation',
    id: `obs-${record.id}-${i}`,
    status: 'final',
    code: { coding: [{ system: 'http://loinc.org', code: l.code, display: l.name }], text: l.name },
    subject: { reference: `Patient/${patientId}` },
    valueQuantity: { value: parseFloat(l.value), unit: l.unit },
    interpretation: l.status === 'high' ? [{ coding: [{ code: 'H', display: 'High' }] }]
      : l.status === 'low' ? [{ coding: [{ code: 'L', display: 'Low' }] }]
      : [{ coding: [{ code: 'N', display: 'Normal' }] }],
  }));

  return {
    resourceType: 'Bundle',
    id: `bundle-${record.id}`,
    type: 'document',
    timestamp: now,
    entry: [
      { resource: patient },
      { resource: encounter },
      ...conditions.map(r => ({ resource: r })),
      ...medications.map(r => ({ resource: r })),
      ...observations.map(r => ({ resource: r })),
    ],
  };
}

export const docTypeLabels = {
  lab_report: { label: 'Lab Report', color: 'text-cyan-400', bg: 'tag-loinc' },
  hospital_bill: { label: 'Hospital Bill', color: 'text-violet-400', bg: 'tag-cpt' },
  discharge_summary: { label: 'Discharge Summary', color: 'text-green-400', bg: 'tag-rx' },
};

export const pipelineSteps = [
  { id: 'ingest', label: 'Document Ingestion', icon: '📄', desc: 'PDF parsing, OCR, layout detection' },
  { id: 'nlp', label: 'Clinical NLP', icon: '🧠', desc: 'Entity extraction, code inference' },
  { id: 'map', label: 'Code Mapping', icon: '🔗', desc: 'ICD-10, CPT, RxNorm, LOINC' },
  { id: 'fhir', label: 'FHIR R4 Mapping', icon: '🏥', desc: 'Structured resource generation' },
  { id: 'billing', label: 'Billing Reconciliation', icon: '💰', desc: 'Claims validation & submission' },
];
