import type { AccessGrant, Consultation, PassportData, PassportInput, Direction, Doctor, DoctorRegistration, Message, PatientRegistration, Session } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? '';
const KEY = 'mb_session';

export class ApiError extends Error { constructor(message: string, public status: number) { super(message) } }

export const session = {
  get: (): Session | null => { try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') } catch { return null } },
  set: (s: Session | null) => (s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY)),
};

/** Every backend response is { message, data }. Returns data, throws ApiError with the backend message. */
async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = session.get()?.token;
  let res: Response;
  try {
    res = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch { throw new ApiError('Cannot reach the server. Check your connection and that the API is running.', 0) }
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) session.set(null);
  if (!res.ok) throw new ApiError(json.message ?? 'Request failed.', res.status);
  return json.data as T;
}

export const api = {
  login: (email: string, password: string) => call<Session>('POST', '/api/auth/login', { email, password }),
  registerPatient: (b: PatientRegistration) => call<Session>('POST', '/api/auth/register/patient', b),
  registerDoctor: (b: DoctorRegistration) => call<unknown>('POST', '/api/auth/register/doctor', b),
  doctors: (specialty?: string) => call<{ doctors: Doctor[] }>('GET', '/api/doctors' + (specialty ? `?specialty=${encodeURIComponent(specialty)}` : '')).then(d => d.doctors),
  verifyDoctor: (id: string, ok: boolean) => call<unknown>('PATCH', `/api/admin/doctors/${id}/${ok ? 'verify' : 'reject'}`),
  consultations: (role: 'PATIENT' | 'DOCTOR') => call<{ consultations: Consultation[] }>('GET', `/api/consultations/${role === 'PATIENT' ? 'patient' : 'doctor'}`).then(d => d.consultations),
  consultation: (id: string) => call<{ consultation: Consultation }>('GET', `/api/consultations/${id}`).then(d => d.consultation),
  request: (doctorId: string, reason: string, symptoms?: string) => call<{ consultation: Consultation }>('POST', '/api/consultations', { doctorId, reason, symptoms }).then(d => d.consultation),
  pay: (id: string) => call<unknown>('PATCH', `/api/consultations/${id}/pay`),
  cancel: (id: string) => call<unknown>('DELETE', `/api/consultations/${id}`),
  accept: (id: string, scheduledAt: string) => call<unknown>('PATCH', `/api/consultations/${id}/accept`, { scheduledAt }),
  decline: (id: string) => call<unknown>('PATCH', `/api/consultations/${id}/decline`),
  complete: (id: string, doctorNotes: string, referral: string) => call<unknown>('PATCH', `/api/consultations/${id}/complete`, { doctorNotes, referral }),
  messages: (id: string) => call<{ messages: Message[] }>('GET', `/api/consultations/${id}/messages`).then(d => d.messages),
  send: (id: string, body: string) => call<unknown>('POST', `/api/consultations/${id}/messages`, { body }),
  translate: (text: string, direction: Direction) => call<{ translatedText: string }>('POST', '/api/translation', { text, direction }).then(d => d.translatedText),
  /** Returns null when the patient has no passport yet (backend answers 404). */
  passport: () => call<{ healthPassport: PassportData['healthPassport'] } & Omit<PassportData, 'healthPassport'>>('GET', '/api/health-passport').then(d => d as PassportData, (e: ApiError) => { if (e.status === 404) return null; throw e }),
  createPassport: (b: PassportInput) => call<unknown>('POST', '/api/health-passport', b),
  updatePassport: (b: PassportInput) => call<unknown>('PATCH', '/api/health-passport', b),
  addItem: (kind: 'allergies' | 'conditions' | 'medications', b: Record<string, string | undefined>) => call<unknown>('POST', `/api/medical-information/${kind}`, b),
  accessList: () => call<{ accesses: AccessGrant[] }>('GET', '/api/health-passport/access').then(d => d.accesses),
  grant: (doctorId: string) => call<unknown>('POST', `/api/health-passport/access/${doctorId}`),
  revoke: (doctorId: string) => call<unknown>('DELETE', `/api/health-passport/access/${doctorId}`),
  patientPassport: (patientId: string) => call<PassportData>('GET', `/api/health-passport/patient/${patientId}`),
};
