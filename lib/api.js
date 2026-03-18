/**
 * MedNorm AI — API Client
 * Wraps all backend endpoints with error handling and loading state.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ─── Core fetch wrapper ──────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  try {
    // Don't override Content-Type for FormData (browser sets multipart boundary automatically)
    const isFormData = options.body instanceof FormData;
    const defaultHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };
    // If caller explicitly passes headers: {}, they want to override defaults (e.g., for file uploads)
    const headers = options.headers !== undefined ? options.headers : defaultHeaders;

    const res = await fetch(url, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `API error ${res.status}`);
    }
    return res.json();
  } catch (e) {
    // Return a structured error so callers can handle gracefully
    throw { message: e.message || String(e), path, ok: false };
  }
}

// ─── Health ──────────────────────────────────────────────────────────────────

export const checkHealth = () => apiFetch('/api/health');

// ─── Document Ingest ─────────────────────────────────────────────────────────

/**
 * Upload a document file for parsing (Step 1).
 * Returns { text, pages, parse_time_s }
 */
export async function ingestDocument(file) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch('/api/ingest', {
    method: 'POST',
    headers: {}, // let browser set multipart boundary
    body: form,
  });
}

// ─── Clinical NLP ────────────────────────────────────────────────────────────

/**
 * Run Clinical NLP + code mapping on raw text (Step 2+3).
 * Returns structured { diagnoses, medications, lab_values, procedures, billing, ... }
 */
export async function processText(text, documentType = null) {
  return apiFetch('/api/process', {
    method: 'POST',
    body: JSON.stringify({ text, document_type: documentType }),
  });
}

// ─── Full Pipeline ────────────────────────────────────────────────────────────

/**
 * End-to-end pipeline: upload file → parse → NLP → FHIR → billing.
 * Returns { record_id, extracted, fhir, billing, ... }
 */
export async function runFullPipeline(file) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch('/api/pipeline', {
    method: 'POST',
    headers: {},
    body: form,
  });
}

// ─── Demo Cases ──────────────────────────────────────────────────────────────

export const getDemoCase = (caseId) =>
  apiFetch(`/api/demo/${caseId}/process`, { method: 'POST' });

// ─── FHIR ────────────────────────────────────────────────────────────────────

export const generateFHIR = (structuredData) =>
  apiFetch('/api/fhir', {
    method: 'POST',
    body: JSON.stringify({ structured_data: structuredData }),
  });

export const getFHIRForRecord = (recordId) =>
  apiFetch(`/api/notes/${recordId}/fhir`);

// ─── Records ─────────────────────────────────────────────────────────────────

export const listRecords = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
  ).toString();
  return apiFetch(`/api/notes${qs ? `?${qs}` : ''}`);
};

export const getRecord = (id) => apiFetch(`/api/notes/${id}`);

export const deleteRecord = (id) =>
  apiFetch(`/api/notes/${id}`, { method: 'DELETE' });

// ─── Billing ─────────────────────────────────────────────────────────────────

export const getBilling = (recordId) =>
  apiFetch(`/api/notes/${recordId}/billing`);

export const submitClaim = (recordId) =>
  apiFetch(`/api/notes/${recordId}/submit-claim`, { method: 'POST' });

// ─── Stats ───────────────────────────────────────────────────────────────────

export const getStats = () => apiFetch('/api/stats');

// ─── React hook: useApi ───────────────────────────────────────────────────────

/**
 * Simple hook for calling API methods with loading + error state.
 *
 * Usage:
 *   const { data, loading, error, call } = useApi(getRecord);
 *   useEffect(() => call('rec_001'), []);
 */
export function useApi(apiFn) {
  // Note: uses React from peer dependency — import in component files instead
  // Provided here as a convenience pattern reference.
  return { call: apiFn };
}
