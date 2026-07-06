import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { duplicateTemplate, emptyLeadForm, leadTemplates } from '../data/templates';
import type {
  FieldKey,
  LeadFormValues,
  RequestHistoryItem,
  ResponseState,
  StatusState,
  TemplateKey,
  ToastKind,
  ToastMessage,
} from '../types/lead';
import { buildPayload, formatResponseBody, networkFailureBody } from '../utils/lead';

interface FieldMeta {
  error?: string;
  invalid?: boolean;
}

type FieldMetaMap = Partial<Record<FieldKey, FieldMeta>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const id = (): string => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useLeadTester = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [urlErrorPulse, setUrlErrorPulse] = useState(false);
  const [values, setValues] = useState<LeadFormValues>(emptyLeadForm);
  const [meta, setMeta] = useState<FieldMetaMap>({});
  const [leadType, setLeadType] = useState('Manual');
  const [lastOkEmail, setLastOkEmail] = useState('');
  const [jsonOpen, setJsonOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<StatusState | null>(null);
  const [response, setResponse] = useState<ResponseState | null>(null);
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  const payload = useMemo(() => buildPayload(values), [values]);

  const dismissFieldMeta = useCallback((field: FieldKey) => {
    setMeta((current) => ({
      ...current,
      [field]: { ...current[field], error: undefined },
    }));
  }, []);

  const showFieldError = useCallback((field: FieldKey, message: string, invalid = false) => {
    setMeta((current) => ({
      ...current,
      [field]: { error: message, invalid },
    }));

    window.setTimeout(() => {
      setMeta((current) => ({
        ...current,
        [field]: { ...current[field], error: undefined },
      }));
    }, 3000);
  }, []);

  const clearAllErrors = useCallback(() => {
    setMeta({});
  }, []);

  const toast = useCallback((type: ToastKind, msg: string) => {
    const toastId = id();
    setToasts((current) => [...current, { id: toastId, type, msg, exiting: false }]);

    window.setTimeout(() => {
      setToasts((current) =>
        current.map((item) => (item.id === toastId ? { ...item, exiting: true } : item)),
      );
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toastId));
      }, 320);
    }, 4000);
  }, []);

  const updateField = useCallback(
    (field: FieldKey, nextValue: string) => {
      let clean = nextValue;

      if (field === 'fn' || field === 'ln') {
        clean = nextValue.replace(/[^a-zA-Z\s'-]/g, '');
        if (clean !== nextValue) {
          showFieldError(
            field,
            'Removed invalid characters — only letters, hyphens, and apostrophes allowed',
          );
        }
      }

      if (field === 'ph') {
        clean = nextValue.replace(/[^0-9\s\-+()]/g, '');
        if (clean !== nextValue) {
          showFieldError(
            field,
            'Removed invalid characters — only digits, +, -, spaces, and parentheses allowed',
          );
        }
      }

      if (field === 'bu') {
        clean = nextValue.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      }

      setValues((current) => ({ ...current, [field]: clean }));

      if (field === 'em') {
        const value = clean.trim();
        if (!value) {
          dismissFieldMeta('em');
          setMeta((current) => ({ ...current, em: { invalid: false } }));
        } else if (!EMAIL_RE.test(value)) {
          showFieldError('em', "This doesn't look like a valid email address", true);
        } else {
          setMeta((current) => ({ ...current, em: { invalid: false } }));
        }
      }
    },
    [dismissFieldMeta, showFieldError],
  );

  const fillTemplate = useCallback(
    (templateKey: TemplateKey) => {
      if (templateKey === 'dup') {
        if (!lastOkEmail) {
          toast('warn', 'No previous successful request to duplicate. Send a successful request first.');
          return;
        }

        setValues(duplicateTemplate(lastOkEmail));
        setLeadType('Duplicate');
        clearAllErrors();
        toast('info', `Duplicate: reusing email ${lastOkEmail}`);
        return;
      }

      const template = leadTemplates[templateKey];
      if (!template) {
        return;
      }

      const { _t, ...nextValues } = template;
      setValues(nextValues);
      setLeadType(_t);
      clearAllErrors();
      toast('info', `Filled: ${_t}`);
    },
    [clearAllErrors, lastOkEmail, toast],
  );

  const clearForm = useCallback(() => {
    setValues(emptyLeadForm);
    setLeadType('Manual');
    clearAllErrors();
    toast('info', 'Form cleared');
  }, [clearAllErrors, toast]);

  const pulseUrlError = useCallback(() => {
    setUrlErrorPulse(true);
    window.setTimeout(() => setUrlErrorPulse(false), 2200);
  }, []);

  const send = useCallback(async () => {
    if (sending) {
      return;
    }

    const url = webhookUrl.trim();
    if (!url) {
      toast('err', 'Please enter a webhook URL before sending.');
      pulseUrlError();
      urlInputRef.current?.focus();
      return;
    }

    try {
      new URL(url);
    } catch {
      toast('err', 'The URL appears to be invalid. Please check the format.');
      pulseUrlError();
      urlInputRef.current?.focus();
      return;
    }

    setSending(true);
    setStatus({ kind: 'pend', text: 'Sending request…' });
    setResponse(null);

    const ts = new Date();
    let historyStatus: RequestHistoryItem['st'] = 'ok';
    let statusLabel = 'Success';

    try {
      const request = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const rawText = await request.text();

      if (request.ok) {
        setStatus({ kind: 'ok', text: `Success — ${request.status} ${request.statusText}` });
        historyStatus = 'ok';
        statusLabel = `${request.status} OK`;
        if (payload.email) {
          setLastOkEmail(payload.email);
        }
      } else {
        setStatus({ kind: 'err', text: `Error — ${request.status} ${request.statusText}` });
        historyStatus = 'err';
        statusLabel = `${request.status} ${request.statusText}`;
      }

      setResponse({ body: formatResponseBody(rawText) });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      historyStatus = 'err';

      if (error instanceof TypeError && message.includes('Failed to fetch')) {
        setStatus({ kind: 'err', text: 'Network error — check the URL or CORS policy' });
        statusLabel = 'Network/CORS Error';
        setResponse({ body: networkFailureBody(message) });
      } else {
        setStatus({ kind: 'err', text: `Error — ${message}` });
        statusLabel = 'Error';
        setResponse({ body: String(error) });
      }
    } finally {
      setHistory((current) => [
        { id: id(), leadType, st: historyStatus, sl: statusLabel, ts },
        ...current,
      ]);
      setSending(false);
    }
  }, [leadType, payload, pulseUrlError, sending, toast, webhookUrl]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        void send();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [send]);

  return {
    webhookUrl,
    setWebhookUrl,
    urlErrorPulse,
    urlInputRef,
    values,
    meta,
    updateField,
    payload,
    jsonOpen,
    setJsonOpen,
    fillTemplate,
    clearForm,
    send,
    sending,
    status,
    response,
    history,
    toasts,
  };
};
