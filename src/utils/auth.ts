import type { User } from '../types';

const KEY = 'studobmen.session';
export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function loadSession(): User | null {
  try { const r = JSON.parse(localStorage.getItem(KEY) ?? 'null'); return r && typeof r.id === 'string' ? (r as User) : null; }
  catch { return null; }
}
export const saveSession = (u: User) => { try { localStorage.setItem(KEY, JSON.stringify(u)); } catch { /* noop */ } };
export const clearSession = () => { try { localStorage.removeItem(KEY); } catch { /* noop */ } };

export const validateLogin = (v: string) =>
  v.trim().length >= 3 ? null : 'Введите TPU ID (номер студбилета) или корпоративную почту @tpu.ru';
export const validatePassword = (v: string) => (v.length >= 4 ? null : 'Минимум 4 символа');