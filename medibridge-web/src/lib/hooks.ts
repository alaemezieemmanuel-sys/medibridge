import { useCallback, useEffect, useState } from 'react';

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [s, set] = useState<{ data?: T; error?: string; loading: boolean }>({ loading: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => { fn().then(data => set({ data, loading: false }), (e: Error) => set(p => ({ ...p, error: e.message, loading: false }))) }, deps);
  useEffect(() => { set(p => ({ ...p, loading: true, error: undefined })); run() }, [run]);
  return { ...s, reload: run };
}

export const toast = (message: string, bad = false) => window.dispatchEvent(new CustomEvent('mb-toast', { detail: { message, bad } }));
export const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Not scheduled');
export const naira = (n: number) => 'NGN ' + Number(n).toLocaleString();
