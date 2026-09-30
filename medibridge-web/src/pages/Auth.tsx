import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { toast } from '../lib/hooks';
import { Field } from '../components/ui';

type Errors = Record<string, string>;
const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="auth"><h1 style={{ fontSize: 28 }}>MEDIBRIDGE</h1><p className="mute">Consult a verified doctor online and keep your medical information in one place.</p>
    <div className="card"><div className="tabs"><Link to="/login">Sign in</Link>&nbsp;|&nbsp;<Link to="/register/patient">Register as patient</Link>&nbsp;|&nbsp;<Link to="/register/doctor">Register as doctor</Link></div>{children}</div></div>
);

export function Login() {
  const { login } = useAuth(); const nav = useNavigate();
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<Errors>({});
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const email = String(f.get('email')).trim(), pw = String(f.get('pw'));
    const errs: Errors = {}; if (!email) errs.email = 'Email is required.'; if (!pw) errs.pw = 'Password is required.'; setErr(errs); if (Object.keys(errs).length) return;
    setBusy(true); try { await login(email, pw); nav('/') } catch (x) { toast((x as Error).message, true) } finally { setBusy(false) }
  }
  return <Shell><form onSubmit={submit} noValidate><Field id="email" name="email" type="email" label="Email" autoComplete="email" error={err.email} /><Field id="pw" name="pw" type="password" label="Password" autoComplete="current-password" error={err.pw} /><div className="row" style={{ marginTop: 14 }}><button className="btn" disabled={busy}>{busy ? 'Signing in' : 'Sign in'}</button></div></form></Shell>;
}

export function Register() {
  const { role } = useParams(); const isPatient = role !== 'doctor'; const { adopt } = useAuth(); const nav = useNavigate();
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<Errors>({});
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const v = (k: string) => String(f.get(k) ?? '').trim();
    const errs: Errors = {};
    for (const k of isPatient ? ['fullName', 'email', 'dateOfBirth', 'location', 'ecName', 'ecPhone', 'ecRel'] : ['fullName', 'email', 'specialty', 'qualifications', 'medicalLicenseNumber']) if (!v(k)) errs[k] = 'This field is required.';
    if (v('email') && !/^\S+@\S+\.\S+$/.test(v('email'))) errs.email = 'Enter a valid email address.';
    if (!/^0\d{10}$/.test(v('phone'))) errs.phone = 'Enter an 11 digit number starting with 0.';
    if (v('password').length < 8) errs.password = 'Use at least 8 characters.';
    if (!isPatient && !(Number(v('consultationPrice')) > 0)) errs.consultationPrice = 'Enter a fee above zero.';
    setErr(errs); if (Object.keys(errs).length) return;
    const base = { fullName: v('fullName'), email: v('email'), phone: v('phone'), password: v('password') };
    setBusy(true);
    try {
      if (isPatient) { adopt(await api.registerPatient({ ...base, dateOfBirth: v('dateOfBirth'), gender: v('gender') as 'MALE' | 'FEMALE', location: v('location'), emergencyContact: { name: v('ecName'), phone: v('ecPhone'), relationship: v('ecRel') } })); nav('/') }
      else { await api.registerDoctor({ ...base, specialty: v('specialty'), qualifications: v('qualifications'), medicalLicenseNumber: v('medicalLicenseNumber'), consultationPrice: Number(v('consultationPrice')) }); toast('Account created. An admin must verify you before patients can find you.'); nav('/login') }
    } catch (x) { toast((x as Error).message, true) } finally { setBusy(false) }
  }
  const F = (id: string, label: string, extra: object = {}) => <Field id={id} name={id} label={label} error={err[id]} {...extra} />;
  return <Shell><form onSubmit={submit} noValidate key={role}>
    {F('fullName', 'Full name')}{F('email', 'Email', { type: 'email' })}{F('phone', 'Phone number', { type: 'tel', help: 'For example, 08012345678' })}{F('password', 'Password', { type: 'password', help: 'At least 8 characters.' })}
    {isPatient ? <>{F('dateOfBirth', 'Date of birth', { type: 'date' })}<label htmlFor="gender">Gender</label><select id="gender" name="gender"><option>MALE</option><option>FEMALE</option></select>{F('location', 'Location')}{F('ecName', 'Emergency contact name')}{F('ecPhone', 'Emergency contact phone', { type: 'tel' })}{F('ecRel', 'Relationship to you')}</>
      : <>{F('specialty', 'Specialty')}{F('qualifications', 'Qualifications')}{F('medicalLicenseNumber', 'Medical licence number')}{F('consultationPrice', 'Consultation fee (NGN)', { type: 'number' })}</>}
    <div className="row" style={{ marginTop: 14 }}><button className="btn" disabled={busy}>{busy ? 'Creating account' : 'Create account'}</button></div></form></Shell>;
}
