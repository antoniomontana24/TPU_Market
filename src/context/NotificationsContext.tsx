import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { INIT_NOTIFICATIONS } from '../data/mock';
import { uid } from '../utils/id';
import type { AppNotification, NotificationType } from '../types';

interface NewNotif { type: NotificationType; title: string; body: string; link?: string; threadId?: string; listingId?: number }
interface NotifCtx {
  items: AppNotification[];
  unread: number;
  push: (n: NewNotif) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  markByThread: (threadId: string) => void;
  clear: () => void;
}

const Ctx = createContext<NotifCtx | null>(null);
const KEY = 'studobmen.notifications';

function load(): AppNotification[] {
  try { const r = JSON.parse(localStorage.getItem(KEY) ?? 'null'); return Array.isArray(r) ? r : INIT_NOTIFICATIONS; }
  catch { return INIT_NOTIFICATIONS; }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AppNotification[]>(load);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* noop */ } }, [items]);

  const push = useCallback((n: NewNotif) =>
    setItems((p) => [{ id: uid('n'), createdAt: Date.now(), read: false, ...n }, ...p].slice(0, 60)), []);

  const markRead = useCallback((id: string) => setItems((p) => p.map((x) => (x.id === id ? { ...x, read: true } : x))), []);
  const markAllRead = useCallback(() => setItems((p) => p.map((x) => ({ ...x, read: true }))), []);
  const markByThread = useCallback((threadId: string) =>
    setItems((p) => p.map((x) => (x.threadId === threadId ? { ...x, read: true } : x))), []);
  const clear = useCallback(() => setItems([]), []);

  const unread = useMemo(() => items.filter((i) => !i.read).length, [items]);
  const value: NotifCtx = { items, unread, push, markRead, markAllRead, markByThread, clear };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotifications(): NotifCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return c;
}