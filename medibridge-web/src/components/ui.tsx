import { ReactNode, useEffect, useState } from 'react';
import type { ConsultationStatus, Verification } from '../types';

export const Badge = ({ s }: { s: ConsultationStatus | Verification }) => <span className={`badge ${s}`}>{s.charAt(0) + s.slice(1).toLowerCase()}</span>;
export const Skeleton = ({ rows = 5 }: { rows?: number }) => <div aria-busy="true">{Array.from({ length: rows }, (_, i) => <div key={i} className="sk" />)}</div>;
export const Empty = ({ title, hint }: { title: string; hint: string }) => <div className="empty"><b>{title}</b>{hint}</div>;
export const ErrorState = ({ message, retry }: { message: string; retry?: () => void }) => (
  <div className="empty" role="alert"><b>Something went wrong</b>{message}{retry && <div style={{ marginTop: 10 }}><button className="btn alt sm" onClick={retry}>Try again</button></div>}</div>
);
export const Field = ({ id, label, error, help, ...p }: { id: string; label: string; error?: string; help?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div><label htmlFor={id}>{label}</label><input id={id} className={error ? 'invalid' : ''} aria-invalid={!!error} {...p} />{help && <div className="help">{help}</div>}{error && <div className="err">{error}</div>}</div>
);
export function ToastHost() {
  const [items, set] = useState<{ id: number; message: string; bad: boolean }[]>([]);
  useEffect(() => {
    const on = (e: Event) => { const d = (e as CustomEvent).detail; const id = Date.now() + Math.random(); set(p => [...p, { id, ...d }]); setTimeout(() => set(p => p.filter(x => x.id !== id)), 3500) };
    window.addEventListener('mb-toast', on); return () => window.removeEventListener('mb-toast', on);
  }, []);
  return <div className="toasts" role="status" aria-live="polite">{items.map(t => <div key={t.id} className={'toast' + (t.bad ? ' e' : '')}>{t.message}</div>)}</div>;
}
export const Card = ({ children }: { children: ReactNode }) => <div className="card">{children}</div>;
