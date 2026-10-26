import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CURRENT_USER, MOCK } from '../data/mock';
import type { Listing, NewListingInput, Status } from '../types';
import { useNotifications } from './NotificationsContext'; 
import { uid } from '../utils/id';

interface Delta { created: Listing[]; removedIds: number[] }
interface ListingsCtx {
  all: Listing[];
  mine: Listing[];
  add: (input: NewListingInput) => number;
  update: (id: number, patch: Partial<Listing>) => void;
  updateStatus: (id: number, status: Status) => void;
  remove: (id: number) => void;
  get: (id: number) => Listing | undefined;
}

const Ctx = createContext<ListingsCtx | null>(null);
const KEY = 'studobmen.listingsDelta';

function load(): Delta {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{"created":[],"removedIds":[]}'); }
  catch { return { created: [], removedIds: [] }; }
}

export function ListingsProvider({ children }: { children: ReactNode }) {
  const notif = useNotifications(); 
  const [delta, setDelta] = useState<Delta>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(delta)); } catch { /* noop */ }
  }, [delta]);

  const all = useMemo<Listing[]>(() => {
    const removed = new Set(delta.removedIds);
    const createdIds = new Set(delta.created.map((c) => c.id));
    const base = MOCK.filter((l) => !removed.has(l.id) && !createdIds.has(l.id));
    return [...base, ...delta.created];
  }, [delta]);

  const mine = useMemo(() => all.filter((l) => l.seller.name === CURRENT_USER.name), [all]);
  const update = (id: number, patch: Partial<Listing>) =>
      setDelta((d) => {
        if (d.created.some((c) => c.id === id))
          return { ...d, created: d.created.map((c) => (c.id === id ? { ...c, ...patch } : c)) };
        const original = MOCK.find((l) => l.id === id);
        if (!original) return d;
        return { ...d, created: [{ ...original, ...patch, id }, ...d.created] };
      });


  const add = (input: NewListingInput): number => {
  const id = Date.now();
  const listing: Listing = { ...input, id, createdAt: Date.now(),
    seller: { name: CURRENT_USER.name, rating: 4.85, reviews: 14, institute: CURRENT_USER.institute } };
  setDelta((d) => ({ ...d, created: [listing, ...d.created] }));
  notif.push({ type: 'moderation',
    title: input.status === 'draft' ? 'Черновик сохранён' : 'Отправлено на модерацию',
    body: input.status === 'draft' ? 'Продолжите оформление в личном кабинете' : 'AI-проверка пройдена, студсовет на связи ~5 минут',
    link: '/profile', listingId: id });
  return id;
};

const updateStatus = (id: number, status: Status) => {
  update(id, { status });
  const map: Partial<Record<Status, [string, string]>> = {
    available:  ['Объявление активно', 'Прошло модерацию и видно покупателям в каталоге'],
    draft:      ['Снято с публикации', 'Возвращено в черновики'],
    moderation: ['Отправлено на модерацию', 'Проверка студсоветом, ~5 минут'],
  };
  const m = map[status];
  if (m) notif.push({ type: 'moderation', title: m[0], body: m[1], link: '/profile', listingId: id });
};

const remove = (id: number) => {
  setDelta((d) => d.created.some((c) => c.id === id)
    ? { ...d, created: d.created.filter((c) => c.id !== id) }
    : { ...d, removedIds: [...d.removedIds, id] });
  notif.push({ type: 'system', title: 'Объявление удалено', body: 'Карточка больше не видна покупателям', link: '/profile' });
};

  const value: ListingsCtx = { all, mine, add, update, updateStatus, remove, get: (id) => all.find((l) => l.id === id) };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useListingsData(): ListingsCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useListingsData must be used inside <ListingsProvider>');
  return c;
}