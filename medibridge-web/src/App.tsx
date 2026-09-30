import { Component, ReactNode } from 'react';
import { BrowserRouter, Link, Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { ToastHost } from './components/ui';
import { Login, Register } from './pages/Auth';
import Doctors from './pages/Doctors';
import { ConsultationDetail, ConsultationList } from './pages/Consultations';
import Admin from './pages/Admin';
import Passport from './pages/Passport';
import PatientPassport from './pages/PatientPassport';

class Boundary extends Component<{ children: ReactNode }, { err?: Error }> {
  state: { err?: Error } = {};
  static getDerivedStateFromError(err: Error) { return { err } }
  render() { return this.state.err ? <div className="card" role="alert"><h2>Something went wrong</h2><p>{this.state.err.message}</p><button className="btn" onClick={() => location.assign('/')}>Reload</button></div> : this.props.children }
}

function Layout() {
  const { user, logout } = useAuth(); if (!user) return <Navigate to="/login" replace />;
  const links = user.role === 'PATIENT' ? [['/', 'Find a doctor'], ['/consultations', 'My consultations'], ['/passport', 'Health Passport']] : user.role === 'DOCTOR' ? [['/', 'Consultations']] : [['/', 'Doctor verification']];
  return <div className="app"><nav className="side" aria-label="Main"><div className="logo">MEDIBRIDGE</div>{links.map(([to, l]) => <NavLink key={to} to={to} end className={({ isActive }) => (isActive ? 'on' : '')}>{l}</NavLink>)}<Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms of use</Link></nav>
    <main className="main"><div className="top"><div className="sm mute">{user.fullName}, {user.role.toLowerCase()}</div><button className="btn alt sm" onClick={logout}>Sign out</button></div><Boundary><Outlet /></Boundary></main></div>;
}
const Home = () => { const { user } = useAuth(); return user!.role === 'PATIENT' ? <Doctors /> : user!.role === 'DOCTOR' ? <ConsultationList /> : <Admin />; };
const Legal = ({ t }: { t: 'privacy' | 'terms' }) => <div className="auth" style={{ maxWidth: 680 }}><h1>{t === 'privacy' ? 'Privacy policy' : 'Terms of use'}</h1><div className="card"><p>{t === 'privacy' ? 'MEDIBRIDGE stores the details you provide: your profile, Health Passport, consultations and messages. Doctors can view your Health Passport only after you grant access. Replace this draft with reviewed legal text before launch.' : 'MEDIBRIDGE connects patients with admin-verified doctors and does not provide emergency care. Payments in this version are test payments. Replace this draft with reviewed legal text before launch.'}</p></div><Link to="/">Back</Link></div>;

export default function App() {
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/login" element={<Login />} /><Route path="/register/:role" element={<Register />} /><Route path="/privacy" element={<Legal t="privacy" />} /><Route path="/terms" element={<Legal t="terms" />} />
    <Route element={<Layout />}><Route index element={<Home />} /><Route path="consultations" element={<ConsultationList />} /><Route path="passport" element={<Passport />} /><Route path="patients/:patientId/passport" element={<PatientPassport />} /><Route path="consultations/:id" element={<ConsultationDetail />} /></Route>
    <Route path="*" element={<Navigate to="/" replace />} /></Routes><ToastHost /></BrowserRouter></AuthProvider>;
}
