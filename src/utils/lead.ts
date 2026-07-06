import type { LeadFormValues, LeadPayload } from '../types/lead';

export const buildPayload = (values: LeadFormValues): LeadPayload => {
  const payload: LeadPayload = {};

  if (values.fn.trim() !== '') payload.firstName = values.fn.trim();
  if (values.ln.trim() !== '') payload.lastName = values.ln.trim();
  if (values.em.trim() !== '') payload.email = values.em.trim();
  if (values.ph.trim() !== '') payload.phone = values.ph.trim();
  if (values.co.trim() !== '') payload.company = values.co.trim();
  if (values.si.trim() !== '') payload.serviceInterest = values.si.trim();
  if (values.ms.trim() !== '') payload.message = values.ms.trim();
  if (values.sr.trim() !== '') payload.source = values.sr.trim();

  const budgetValue = values.bu.trim();
  if (budgetValue !== '') {
    const parsedBudget = Number(budgetValue);
    if (!Number.isNaN(parsedBudget)) {
      payload.budget = parsedBudget;
    }
  }

  return payload;
};

export const formatResponseBody = (raw: string): string => {
  if (!raw) {
    return '(empty response body)';
  }

  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
};

export const networkFailureBody = (message: string): string =>
  'Fetch failed. This usually means one of two things:\n\n' +
  '1. The URL is unreachable (wrong address, server down, DNS issue, etc.)\n\n' +
  '2. CORS blocking: The webhook server is not returning the necessary\n' +
  '   Access-Control-Allow-Origin headers for browser-based requests.\n\n' +
  'If the webhook works in Postman but fails here, it is almost certainly\n' +
  'a CORS issue. Your n8n instance needs to allow cross-origin requests,\n' +
  'or you can use Postman / curl as a fallback for testing.\n\n' +
  `Error detail: ${message}`;
