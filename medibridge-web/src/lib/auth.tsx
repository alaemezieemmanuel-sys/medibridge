import { createContext, ReactNode, useContext, useState } from 'react';
import { api, session } from './api';
import type { Session, User } from '../types';

interface Ctx { user: User | null; login: (e: string, p: string) => Promise<void>; adopt: (s: Session) => void; logout: () => void }
const AuthCtx = createContext<Ctx>(null!);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(session.get()?.user ?? null);
  const adopt = (s: Session) => { session.set(s); setUser(s.user) };
  const login = async (e: string, p: string) => adopt(await api.login(e, p));
  const logout = () => { session.set(null); setUser(null) };
  return <AuthCtx.Provider value={{ user, login, adopt, logout }}>{children}</AuthCtx.Provider>;
}
