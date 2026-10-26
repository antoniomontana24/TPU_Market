import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { MOCK } from '../data/mock';
import { uid } from '../utils/id';
import { useListingsData } from './ListingsContext';
import { useNotifications } from './NotificationsContext';
import type { Booking, CancelledBooking, CompletedDeal, Listing } from '../types';

const nowPlus = (h: number, m = 0) => Date.now() + (h * 3600 + m * 60) * 1000;
const hhmm = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
const shortDorm = (d: string) => d.split(' (')[0];

const START_BOOKING: Booking = (() => {
  const l = MOCK[0];
  return { id: 'TPU-8492', listingId: l.id, sku: `ТПУ-13-${8940 + l.id}`, title: l.title, price: l.price,
    dorm: l.dorm, seller: l.seller.name, interval: 'Сегодня, 18:30–19:30', expiresAt: nowPlus(3, 42), createdAt: Date.now() };
})();
const START_COMPLETED: CompletedDeal[] = [
  { id: 'TPU-7910', when: 'Вчера 16:40', title: 'Задачник по ТОЭ (Демирчян) + методичка', counterparty: 'Продавец: Екатерина В. (Общ. №19)', price: 350, kind: 'buy', review: 5 },
  { id: 'TPU-7305', when: '12 мая', title: 'Wi-Fi роутер Keenetic City Dual-band', counterparty: 'Продавец: Михаил П. (Общ. №16)', price: 1400, kind: 'buy' },
  { id: 'TPU-6840', when: '5 мая', title: 'Настольная лампа LED с USB', counterparty: 'Отдал: Александр С. (Общ. №13)', price: 0, kind: 'gift', review: 5 },
  { id: 'TPU-6120', when: '28 апр', title: 'Электрочайник Tefal 1.7L', counterparty: 'Вы продали: Максим В.', price: 850, kind: 'sell' },
];

interface BookingsCtx {
  bookings: Booking[]; completed: CompletedDeal[]; cancelled: CancelledBooking[];
  createFromListing: (l: Listing, interval: string) => void;
  confirm: (id: string) => void;
  cancel: (id: string) => void;
  reschedule: (id: string, patch: { interval?: string; extendHours?: number }) => void;
}

const Ctx = createContext<BookingsCtx | null>(null);
const KEY = 'studobmen.bookings';

interface Persist { bookings: Booking[]; completed: CompletedDeal[]; cancelled: CancelledBooking[] }
function load(): Persist {
  try { const r = JSON.parse(localStorage.getItem(KEY) ?? 'null'); if (r?.bookings) return r; } catch { /* noop */ }
  return { bookings: [START_BOOKING], completed: START_COMPLETED, cancelled: [] };
}

export function BookingsProvider({ children }: { children: ReactNode }) {
  const listings = useListingsData();
  const notif = useNotifications();
  const [state, setState] = useState<Persist>(load);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* noop */ } }, [state]);

  const createFromListing = useCallback((l: Listing, interval: string) => {
    const b: Booking = { id: uid('TPU').toUpperCase().replace('_', '-'), listingId: l.id, sku: `ТПУ-13-${8940 + l.id}`,
      title: l.title, price: l.price, dorm: l.dorm, seller: l.seller.name, interval, expiresAt: nowPlus(24), createdAt: Date.now() };
    setState((s) => ({ ...s, bookings: [b, ...s.bookings] }));
    notif.push({ type: 'booking', title: 'Бронь создана', body: `«${l.title}» удерживаем 24 ч без предоплаты. ${shortDorm(l.dorm)}`, listingId: l.id, link: '/profile' });
  }, [notif]);

  const confirm = useCallback((id: string) => {
    setState((s) => {
      const b = s.bookings.find((x) => x.id === id);
      if (!b) return s;
      const done: CompletedDeal = { id: b.id, when: `Сегодня ${hhmm()}`, title: b.title,
        counterparty: `Продавец: ${b.seller} (${shortDorm(b.dorm)})`, price: b.price, kind: 'buy' };
      return { ...s, bookings: s.bookings.filter((x) => x.id !== id), completed: [done, ...s.completed] };
    });
    const b = state.bookings.find((x) => x.id === id);
    if (b) {
      listings.updateStatus(b.listingId, 'sold');           // объявление уходит из каталога
      notif.push({ type: 'purchase', title: 'Сделка завершена', body: `«${b.title}» получено. Оставьте отзыв соседу — 5 секунд`, listingId: b.listingId, link: '/profile' });
    }
  }, [state.bookings, listings, notif]);

  const cancel = useCallback((id: string) => {
    const b = state.bookings.find((x) => x.id === id);
    setState((s) => ({ ...s,
      bookings: s.bookings.filter((x) => x.id !== id),
      cancelled: b ? [{ id: b.id, when: `Сегодня ${hhmm()}`, title: b.title, reason: 'Отменено вами' }, ...s.cancelled] : s.cancelled }));
    if (b) notif.push({ type: 'booking', title: 'Бронь отменена', body: `«${b.title}» снова доступно другим студентам`, listingId: b.listingId, link: '/' });
  }, [state.bookings, notif]);

  const reschedule = useCallback((id: string, patch: { interval?: string; extendHours?: number }) => {
    setState((s) => ({ ...s, bookings: s.bookings.map((b) => b.id === id
      ? { ...b, interval: patch.interval?.trim() || b.interval, expiresAt: patch.extendHours ? nowPlus(patch.extendHours) : b.expiresAt }
      : b) }));
    const b = state.bookings.find((x) => x.id === id);
    if (b) notif.push({ type: 'booking', title: patch.extendHours ? 'Бронь продлена' : 'Время встречи изменено',
      body: patch.extendHours ? `Держим «${b.title}» ещё ${patch.extendHours} ч` : `Новый слот по «${b.title}»: ${patch.interval}`, listingId: b.listingId, link: '/profile' });
  }, [state.bookings, notif]);

  const value = useMemo(() => ({ bookings: state.bookings, completed: state.completed, cancelled: state.cancelled, createFromListing, confirm, cancel, reschedule }),
    [state, createFromListing, confirm, cancel, reschedule]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBookings(): BookingsCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useBookings must be used inside <BookingsProvider>');
  return c;
}