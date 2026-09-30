import { FormEvent, useState } from 'react';
import { api } from '../lib/api';
import { toast } from '../lib/hooks';
import { Card } from '../components/ui';

/** The API has no "list pending doctors" route, so an admin acts on a doctor ID. */
export default function Admin() {
  const [id, setId] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  async function go(ok: boolean, e?: FormEvent) {
    e?.preventDefault(); if (!id.trim()) return setErr('Enter a doctor ID.'); setErr(''); setBusy(true);
    try { await api.verifyDoctor(id.trim(), ok); toast(ok ? 'Doctor verified' : 'Doctor rejected'); setId('') } catch (x) { toast((x as Error).message, true) } finally { setBusy(false) }
  }
  return <><h1>Doctor verification</h1><p className="mute">Doctors appear in patient search only after you verify them.</p>
    <Card><form onSubmit={e => go(true, e)} noValidate style={{ maxWidth: 480 }}><label htmlFor="id">Doctor ID</label><input id="id" value={id} onChange={e => setId(e.target.value)} />{err && <div className="err">{err}</div>}<div className="help">Copy the ID from the new doctor's registration response or the database.</div>
      <div className="row" style={{ marginTop: 12 }}><button className="btn" disabled={busy}>Verify</button><button type="button" className="btn bad" disabled={busy} onClick={() => go(false)}>Reject</button></div></form></Card></>;
}
