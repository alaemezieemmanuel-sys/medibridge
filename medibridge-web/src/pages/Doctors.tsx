import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { naira, toast, useAsync } from '../lib/hooks';
import { Empty, ErrorState, Skeleton } from '../components/ui';
import type { Doctor } from '../types';

const PAGE = 5;
export default function Doctors() {
  const { data, loading, error, reload } = useAsync(() => api.doctors(), []);
  const [q, setQ] = useState(''); const [page, setPage] = useState(0); const [sort, setSort] = useState<{ k: 'name' | 'specialty' | 'fee'; d: 1 | -1 }>({ k: 'name', d: 1 });
  const [open, setOpen] = useState<Doctor | null>(null); const [reason, setReason] = useState(''); const [rErr, setRErr] = useState(''); const [busy, setBusy] = useState(false); const nav = useNavigate();
  const rows = useMemo(() => {
    const key = (d: Doctor) => (sort.k === 'name' ? d.user.fullName : sort.k === 'specialty' ? d.specialty : d.consultationPrice);
    return (data ?? []).filter(d => (d.user.fullName + d.specialty).toLowerCase().includes(q.toLowerCase())).sort((a, b) => (key(a) > key(b) ? 1 : -1) * sort.d);
  }, [data, q, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE)); const cur = Math.min(page, pages - 1);
  const th = (k: typeof sort.k, l: string) => <th aria-sort={sort.k === k ? (sort.d === 1 ? 'ascending' : 'descending') : 'none'}><button onClick={() => setSort({ k, d: sort.k === k ? (-sort.d as 1 | -1) : 1 })}>{l}</button></th>;
  async function send() {
    if (reason.trim().length < 10) return setRErr('Describe your symptoms in at least 10 characters.');
    setBusy(true); try { const c = await api.request(open!.id, reason.trim()); toast('Consultation requested'); nav(`/consultations/${c.id}`) } catch (e) { toast((e as Error).message, true) } finally { setBusy(false) }
  }
  return <><h1>Find a doctor</h1><p className="mute">Only admin-verified doctors are listed.</p>
    <div className="card">{loading && !data ? <Skeleton rows={6} /> : error && !data ? <ErrorState message={error} retry={reload} /> : <>
      <label htmlFor="q">Search by name or specialty</label><input id="q" value={q} onChange={e => { setQ(e.target.value); setPage(0) }} placeholder="For example, Cardiology" />
      {rows.length ? <div className="tw"><table><thead><tr>{th('name', 'Doctor')}{th('specialty', 'Specialty')}<th>Qualifications</th>{th('fee', 'Fee')}<th /></tr></thead><tbody>
        {rows.slice(cur * PAGE, cur * PAGE + PAGE).map(d => <tr key={d.id}><td>{d.user.fullName}</td><td>{d.specialty}</td><td>{d.qualifications}</td><td>{naira(d.consultationPrice)}</td><td><button className="btn sm" onClick={() => { setOpen(d); setReason(''); setRErr('') }}>Request consultation</button></td></tr>)}</tbody></table></div>
        : <Empty title="No doctors match your search" hint="Try a different name or specialty." />}
      <div className="row sm" style={{ marginTop: 10 }}><button className="btn alt sm" disabled={cur < 1} onClick={() => setPage(cur - 1)}>Previous</button><span>Page {cur + 1} of {pages}</span><button className="btn alt sm" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>Next</button></div></>}</div>
    {open && <div className="card"><h2>Request consultation with {open.user.fullName}</h2><label htmlFor="reason">What would you like help with?</label><textarea id="reason" rows={3} value={reason} onChange={e => setReason(e.target.value)} /><div className="help">Describe your symptoms and how long you have had them. Pidgin is fine.</div>{rErr && <div className="err">{rErr}</div>}
      <div className="row" style={{ marginTop: 12 }}><button className="btn" disabled={busy} onClick={send}>Send request</button><button className="btn alt" onClick={() => setOpen(null)}>Cancel</button></div></div>}</>;
}
