import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { fmtDate, naira, toast, useAsync } from '../lib/hooks';
import { Badge, Card, Empty, ErrorState, Skeleton } from '../components/ui';
import type { Consultation, ConsultationStatus } from '../types';

export function ConsultationList() {
  const { user } = useAuth(); const doc = user!.role === 'DOCTOR';
  const { data, loading, error, reload } = useAsync(() => api.consultations(user!.role as 'PATIENT' | 'DOCTOR'), [user]);
  const count = (s: ConsultationStatus) => data?.filter(c => c.status === s).length ?? 0;
  return <><h1>{doc ? 'Consultations' : 'My consultations'}</h1>
    <div className="grid">{(['REQUESTED', 'PAID', 'SCHEDULED', 'COMPLETED'] as const).map(s => <div key={s} className="card stat"><b>{count(s)}</b><span className="mute sm">{s.charAt(0) + s.slice(1).toLowerCase()}</span></div>)}</div>
    <Card>{loading && !data ? <Skeleton /> : error && !data ? <ErrorState message={error} retry={reload} /> : data!.length === 0 ? <Empty title="No consultations yet" hint={doc ? 'Requests from patients will appear here.' : 'Find a doctor to request your first consultation.'} /> :
      <div className="tw"><table><thead><tr><th>{doc ? 'Patient' : 'Doctor'}</th><th>Reason</th><th>Status</th><th>Appointment</th><th /></tr></thead><tbody>
        {data!.map((c: Consultation) => <tr key={c.id}><td>{doc ? c.patient?.user.fullName : c.doctor?.user.fullName}</td><td>{c.reason.slice(0, 70)}</td><td><Badge s={c.status} /></td><td>{fmtDate(c.scheduledAt)}</td><td><Link to={`/consultations/${c.id}`}>Open</Link></td></tr>)}</tbody></table></div>}</Card></>;
}

export function ConsultationDetail() {
  const { id = '' } = useParams(); const { user } = useAuth(); const doc = user!.role === 'DOCTOR';
  const { data: c, loading, error, reload } = useAsync(() => api.consultation(id), [id]);
  const [busy, setBusy] = useState(false); const [at, setAt] = useState(''); const [notes, setNotes] = useState(''); const [ref, setRef] = useState(''); const [fe, setFe] = useState('');
  async function act(fn: () => Promise<unknown>, ok: string) { setBusy(true); try { await fn(); toast(ok); reload() } catch (e) { toast((e as Error).message, true) } finally { setBusy(false) } }
  if (loading && !c) return <Card><Skeleton rows={4} /></Card>;
  if (error && !c) return <Card><ErrorState message={error} retry={reload} /></Card>;
  if (!c) return null;
  const s = c.status;
  return <><Link to="/">Back</Link><h1>{doc ? c.patient?.user.fullName : c.doctor?.user.fullName} <Badge s={s} /></h1><p className="mute">Appointment: {fmtDate(c.scheduledAt)}</p>
    <Card><h2>Reason for visit</h2><p>{c.reason}</p>{c.doctorNotes && <><h2>Doctor notes</h2><p>{c.doctorNotes}</p></>}{c.referral && <><h2>Referral</h2><p>{c.referral}</p></>}
      <div className="row">
        {!doc && s === 'REQUESTED' && <button className="btn" disabled={busy} onClick={() => act(() => api.pay(id), 'Payment received')}>Pay {c.doctor ? naira(c.doctor.consultationPrice) : ''} (test payment)</button>}
        {!doc && ['REQUESTED', 'PAID', 'SCHEDULED'].includes(s) && <button className="btn bad" disabled={busy} onClick={() => act(() => api.cancel(id), 'Consultation cancelled')}>Cancel consultation</button>}
        {doc && s === 'PAID' && <div><label htmlFor="at">Appointment time</label><input id="at" type="datetime-local" value={at} onChange={e => setAt(e.target.value)} />{fe && <div className="err">{fe}</div>}<button className="btn" style={{ marginTop: 8 }} disabled={busy} onClick={() => at ? act(() => api.accept(id, new Date(at).toISOString()), 'Consultation scheduled') : setFe('Choose an appointment time.')}>Accept and schedule</button></div>}
        {doc && ['REQUESTED', 'PAID'].includes(s) && <button className="btn bad" disabled={busy} onClick={() => act(() => api.decline(id), 'Consultation declined')}>Decline</button>}
        {doc && s === 'SCHEDULED' && <div style={{ width: '100%' }}><label htmlFor="n">Doctor notes</label><textarea id="n" rows={3} value={notes} onChange={e => setNotes(e.target.value)} /><label htmlFor="r">Referral (optional)</label><input id="r" value={ref} onChange={e => setRef(e.target.value)} />{fe && <div className="err">{fe}</div>}<button className="btn" style={{ marginTop: 8 }} disabled={busy} onClick={() => notes.trim() || ref.trim() ? act(() => api.complete(id, notes, ref), 'Consultation completed') : setFe('Add doctor notes or a referral.')}>Mark completed</button></div>}
        {doc && <Link to={`/patients/${c.patientId}/passport`}>View patient Health Passport</Link>}
      </div></Card>
    <Chat id={id} userId={user!.id} doc={doc} /></>;
}

function Chat({ id, userId, doc }: { id: string; userId: string; doc: boolean }) {
  const { data, loading, error, reload } = useAsync(() => api.messages(id), [id]);
  const [body, setBody] = useState(''); const [tr, setTr] = useState<Record<string, string>>({});
  useEffect(() => { const t = setInterval(reload, 4000); return () => clearInterval(t) }, [reload]);
  async function send() { if (!body.trim()) return; try { await api.send(id, body); setBody(''); reload() } catch (e) { toast((e as Error).message, true) } }
  async function translate(mid: string, text: string) { try { setTr(p => ({ ...p, [mid]: '...' })); const out = await api.translate(text, doc ? 'PIDGIN_TO_ENGLISH' : 'ENGLISH_TO_PIDGIN'); setTr(p => ({ ...p, [mid]: out })) } catch (e) { toast((e as Error).message, true) } }
  return <Card><h2>Messages</h2>{loading && !data ? <Skeleton rows={3} /> : error && !data ? <ErrorState message={error} retry={reload} /> :
    <div className="chat" aria-live="polite">{data!.length === 0 ? <Empty title="No messages yet" hint="Say hello to start the conversation." /> : data!.map(m => <div key={m.id} className={'msg' + (m.senderId === userId ? ' me' : '')}><small>{fmtDate(m.createdAt)}</small>{m.body}
      {m.senderId !== userId && <div><button className="btn alt sm" onClick={() => translate(m.id, m.body)}>{doc ? 'Translate to English' : 'Translate to Pidgin'}</button></div>}{tr[m.id] && <div className="tr">{tr[m.id]}</div>}</div>)}</div>}
    <div className="row"><input aria-label="Message" value={body} onChange={e => setBody(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Write a message" style={{ flex: '1 1 200px' }} /><button className="btn" onClick={send}>Send</button></div>
    <p className="help">Messages refresh every few seconds.</p></Card>;
}
