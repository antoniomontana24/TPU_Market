import { useMemo, useState } from 'react';
import { useBookings } from '../context/BookingsContext';
import { useChat } from '../context/ChatContext';
import { money } from '../utils/format';

const STEPS = ['Бронь создана', 'Подтверждено продавцом', 'Встреча', 'Тест и расчёт', 'Завершение'];
const EXTEND = [0, 2, 4, 6, 12, 24];
const TABS = [['all', 'Все'], ['active', 'Активные брони'], ['buy', 'Покупки'], ['sell', 'Продажи / дар'], ['archive', 'Архив и отменённые']] as const;
type Tab = typeof TABS[number][0];

function Countdown({ target }: { target: number }) {
  const [now, setNow] = useState(Date.now());
  useMemo(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const left = Math.max(0, target - now);
  const p = (n: number) => String(n).padStart(2, '0');
  return <span>{p(Math.floor(left / 3600_000))} ч {p(Math.floor((left % 3600_000) / 60_000))} мин {p(Math.floor((left % 60_000) / 1000))} сек</span>;
}

export function OrdersTab() {
  const { bookings, completed, cancelled, confirm, cancel, reschedule } = useBookings();
  const chat = useChat();
  const [tab, setTab] = useState<Tab>('all');
  const [editing, setEditing] = useState<string | null>(null);
  const [draftInterval, setDraftInterval] = useState('');
  const [draftExtend, setDraftExtend] = useState(0);

  const counts = {
    all: bookings.length + completed.length + cancelled.length,
    active: bookings.length,
    buy: completed.filter((c) => c.kind === 'buy').length,
    sell: completed.filter((c) => c.kind !== 'buy').length,
    archive: cancelled.length,
  };
  const openEdit = (id: string, interval: string) => { setEditing(id); setDraftInterval(interval); setDraftExtend(0); };
  const saveEdit = (id: string) => { reschedule(id, { interval: draftInterval, extendHours: draftExtend }); setEditing(null); };

  const showB = tab === 'all' || tab === 'active';
  const showC = tab === 'all' || tab === 'buy' || tab === 'sell';
  const showX = tab === 'all' || tab === 'archive';
  const compRows = completed.filter((c) => tab === 'all' ? true : tab === 'buy' ? c.kind === 'buy' : tab === 'sell' ? c.kind !== 'buy' : false);

  return (
    <div className="orders">
      <div className="orders__head"><strong>{counts.active} {counts.active === 1 ? 'активная бронь' : 'активных брони'}</strong>
        <span className="muted">·</span><strong>{counts.buy + counts.sell} завершено</strong></div>

      {showB && bookings.map((b) => (
        <section className="booking" key={b.id}>
          <div className="card__row"><h2>Активная бронь #{b.id}</h2><span className="badge badge--hold">удержание без предоплаты</span></div>
          <div className="booking__timer">⏳ <b><Countdown target={b.expiresAt} /></b> <small>до завершения брони</small></div>
          <div className="booking__item"><span aria-hidden>📦</span>
            <div><strong>{b.title}</strong><br /><small>{b.sku} · {b.dorm.split(' (')[0]} · оплата на месте</small></div>
            <strong className="price">{money(b.price)}</strong></div>
          <ol className="steps">{STEPS.map((s, i) => <li key={s} className={i <= 2 ? 'is-done' : i === 3 ? 'is-current' : ''}><b>{i + 1}.</b> {s}</li>)}</ol>

          {editing === b.id ? (
            <div className="edit-row">
              <label className="field">Новое время встречи<input value={draftInterval} onChange={(e) => setDraftInterval(e.target.value)} /></label>
              <label className="field">Продлить бронь на
                <select value={draftExtend} onChange={(e) => setDraftExtend(Number(e.target.value))}>
                  {EXTEND.map((h) => <option key={h} value={h}>{h === 0 ? 'не продлевать' : `${h} ч`}</option>)}</select></label>
              <div className="ml-card__actions">
                <button className="btn btn--green" onClick={() => saveEdit(b.id)}>Сохранить</button>
                <button className="btn btn--ghost" onClick={() => setEditing(null)}>Отмена</button></div>
            </div>
          ) : <p className="muted"><small>Встреча: {b.interval}. Тест в розетке на посту дежурного вахтера.</small></p>}

          <div className="ml-card__actions">
            <button className="btn btn--green" onClick={() => confirm(b.id)}>Подтвердить получение</button>
            <button className="btn btn--ghost" onClick={() => openEdit(b.id, b.interval)}>Изменить время</button>
            <button className="btn btn--ghost" onClick={() => chat.openByListingId(b.listingId)}>Открыть чат с продавцом</button>
            <button className="link link--danger" onClick={() => cancel(b.id)}>Отменить бронь</button>
          </div>
        </section>
      ))}
      {showB && bookings.length === 0 && <p className="state">Активных броней нет.</p>}

      <div className="pager-tabs">{TABS.map(([v, l]) => (
        <button key={v} className={tab === v ? 'is-active' : ''} onClick={() => setTab(v)}>{l} ({counts[v]})</button>))}</div>

      {showC && (<><h2>История завершённых сделок</h2>
        {compRows.length === 0 && <p className="state">В этом разделе пока пусто.</p>}
        {compRows.map((p) => (
          <article className="purchase" key={p.id}>
            <div className="card__row"><div><strong>{p.title}</strong><br /><small>{p.when} · #{p.id} · {p.counterparty}</small></div>
              <strong className="price">{p.price === 0 ? '0 ₽' : money(p.price)}</strong></div>
            {p.review ? <span className="tag tag--free">Отзыв опубликован ★ {p.review.toFixed(1)}</span>
                      : <button className="btn btn--ghost">Оставить отзыв</button>}
          </article>))}</>)}

      {showX && (<><h2>Отменённые брони</h2>
        {cancelled.length === 0 && <p className="state">Отменённых броней нет.</p>}
        {cancelled.map((c) => (
          <article className="purchase" key={c.id}>
            <div className="card__row"><div><strong>{c.title}</strong><br /><small>{c.when} · #{c.id} · {c.reason}</small></div>
              <span className="badge badge--sold" style={{ position: 'static' }}>ОТМЕНА</span></div>
          </article>))}</>)}
    </div>
  );
}