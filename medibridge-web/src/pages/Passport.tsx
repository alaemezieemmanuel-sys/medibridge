import { FormEvent, useState } from 'react';
import { api } from '../lib/api';
import { toast, useAsync } from '../lib/hooks';
import { Card, Empty, ErrorState, Skeleton } from '../components/ui';
import type { PassportData } from '../types';

const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], GENO = ['AA', 'AS', 'SS', 'AC', 'SC'];
interface Spec { key: string; label: string; type?: 'date' | 'select'; opts?: string[]; required?: boolean }

function Section<T extends { id: string }>({ title, kind, items, specs, line, reload }: { title: string; kind: 'allergies' | 'conditions' | 'medications'; items: T[]; specs: Spec[]; line: (i: T) => string; reload: () => void }) {
  const [err, setErr] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const f = new FormData(form); const errs: Record<string, string> = {}; const body: Record<string, string | undefined> = {};
    for (const s of specs) { const v = String(f.get(s.key) ?? '').trim(); if (s.required && !v) errs[s.key] = 'Required.'; body[s.key] = v || undefined }
    setErr(errs); if (Object.keys(errs).length) return;
    setBusy(true); try { await api.addItem(kind, body); toast('Added'); form.reset(); reload() } catch (x) { toast((x as Error).message, true) } finally { setBusy(false) }
  }
  return <Card><h2>{title}</h2>{items.length ? <ul>{items.map(i => <li key={i.id}>{line(i)}</li>)}</ul> : <p className="mute sm">None recorded.</p>}
    <form onSubmit={submit} noValidate className="grid" style={{ marginTop: 8 }}>{specs.map(s => <div key={s.key}><label htmlFor={kind + s.key}>{s.label}</label>{s.type === 'select' ? <select id={kind + s.key} name={s.key}>{s.opts!.map(o => <option key={o}>{o}</option>)}</select> : <input id={kind + s.key} name={s.key} type={s.type ?? 'text'} />}{err[s.key] && <div className="err">{err[s.key]}</div>}</div>)}
      <div style={{ alignSelf: 'end' }}><button className="btn alt" disabled={busy}>Add</button></div></form></Card>;
}

export default function Passport() {
  const { data, loading, error, reload } = useAsync(async () => ({ p: await api.passport(), access: await api.accessList(), doctors: await api.doctors() }), []);
  const [busy, setBusy] = useState(false);
  if (loading && !data) return <><h1>Health Passport</h1><Card><Skeleton rows={6} /></Card></>;
  if (error && !data) return <Card><ErrorState message={error} retry={reload} /></Card>;
  const { p, access, doctors } = data!;
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const n = (k: string) => (f.get(k) ? Number(f.get(k)) : undefined);
    const body = { bloodGroup: String(f.get('bloodGroup')), genotype: String(f.get('genotype')), height: n('height'), weight: n('weight'), notes: String(f.get('notes') ?? '') || undefined };
    setBusy(true); try { await (p ? api.updatePassport(body) : api.createPassport(body)); toast(p ? 'Health Passport saved' : 'Health Passport created'); reload() } catch (x) { toast((x as Error).message, true) } finally { setBusy(false) }
  }
  async function toggle(id: string, on: boolean) { try { await (on ? api.revoke(id) : api.grant(id)); toast(on ? 'Access revoked' : 'Access granted'); reload() } catch (x) { toast((x as Error).message, true) } }
  const hp = p?.healthPassport;
  return <><h1>Health Passport</h1><p className="mute">Your medical information. Doctors can only see it after you share it.</p>
    <Card><h2>{p ? 'Basic details' : 'Create your Health Passport'}</h2><form onSubmit={save} key={hp?.id ?? 'new'} className="grid">
      <div><label htmlFor="bg">Blood group</label><select id="bg" name="bloodGroup" defaultValue={hp?.bloodGroup ?? 'O+'}>{BLOOD.map(b => <option key={b}>{b}</option>)}</select></div>
      <div><label htmlFor="gt">Genotype</label><select id="gt" name="genotype" defaultValue={hp?.genotype ?? 'AA'}>{GENO.map(b => <option key={b}>{b}</option>)}</select></div>
      <div><label htmlFor="h">Height (cm)</label><input id="h" name="height" type="number" min="0" defaultValue={hp?.height ?? ''} /></div>
      <div><label htmlFor="w">Weight (kg)</label><input id="w" name="weight" type="number" min="0" defaultValue={hp?.weight ?? ''} /></div>
      <div style={{ gridColumn: '1/-1' }}><label htmlFor="nt">Notes</label><textarea id="nt" name="notes" rows={2} defaultValue={hp?.notes ?? ''} /></div>
      <div><button className="btn" disabled={busy}>{p ? 'Save changes' : 'Create Health Passport'}</button></div></form></Card>
    {p && <>
      <Section title="Allergies" kind="allergies" items={p.allergies} reload={reload} line={a => `${a.allergen}, ${a.severity.toLowerCase()}${a.reaction ? `, reaction: ${a.reaction}` : ''}`} specs={[{ key: 'allergen', label: 'Allergen', required: true }, { key: 'reaction', label: 'Reaction' }, { key: 'severity', label: 'Severity', type: 'select', opts: ['MILD', 'MODERATE', 'SEVERE'] }]} />
      <Section title="Medical conditions" kind="conditions" items={p.medicalConditions} reload={reload} line={c => `${c.name}, ${c.status.toLowerCase()}`} specs={[{ key: 'name', label: 'Condition', required: true }, { key: 'diagnosedAt', label: 'Diagnosed on', type: 'date' }, { key: 'status', label: 'Status', type: 'select', opts: ['ACTIVE', 'MANAGED', 'RESOLVED'] }]} />
      <Section title="Medications" kind="medications" items={p.medications} reload={reload} line={m => `${m.name}${m.dosage ? `, ${m.dosage}` : ''}${m.frequency ? `, ${m.frequency}` : ''} (${m.status.toLowerCase()})`} specs={[{ key: 'name', label: 'Medication', required: true }, { key: 'dosage', label: 'Dosage' }, { key: 'frequency', label: 'Frequency' }, { key: 'status', label: 'Status', type: 'select', opts: ['ACTIVE', 'COMPLETED', 'DISCONTINUED'] }]} />
      <Card><h2>Doctor access</h2>{doctors.length === 0 ? <Empty title="No verified doctors yet" hint="Doctors appear here once an admin verifies them." /> : doctors.map(d => { const on = access.some(a => a.doctorId === d.id); return <div key={d.id} className="row" style={{ justifyContent: 'space-between', padding: '6px 0' }}><span>{d.user.fullName}, {d.specialty} {on && <span className="badge VERIFIED">Has access</span>}</span><button className={'btn sm ' + (on ? 'bad' : 'alt')} onClick={() => toggle(d.id, on)}>{on ? 'Revoke access' : 'Grant access'}</button></div> })}</Card></>}</>;
}
