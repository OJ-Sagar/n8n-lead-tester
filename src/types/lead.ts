export type FieldKey = 'fn' | 'ln' | 'em' | 'ph' | 'co' | 'bu' | 'si' | 'sr' | 'ms';

export type TemplateKey = 'hot' | 'warm' | 'cold' | 'inc' | 'rev' | 'dup';

export type StatusKind = 'ok' | 'err';

export type ToastKind = 'info' | 'warn' | 'err';

export interface LeadFormValues {
  fn: string;
  ln: string;
  em: string;
  ph: string;
  co: string;
  bu: string;
  si: string;
  sr: string;
  ms: string;
}

export interface LeadPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  message?: string;
  source?: string;
  budget?: number;
}

export interface LeadTemplate extends LeadFormValues {
  _t: string;
}

export interface RequestHistoryItem {
  id: string;
  leadType: string;
  st: StatusKind;
  sl: string;
  ts: Date;
}

export interface StatusState {
  kind: 'pend' | 'ok' | 'err';
  text: string;
}

export interface ResponseState {
  body: string;
}

export interface ToastMessage {
  id: string;
  type: ToastKind;
  msg: string;
  exiting: boolean;
}
