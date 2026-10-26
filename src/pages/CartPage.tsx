import { useMemo, useState } from 'react';
import { createOrder } from '../api/orders';
import { useCart } from '../context/CartContext';
import { CURRENT_USER } from '../data/mock';
import { useListings } from '../hooks/useListings';
import { DEFAULT_FILTERS, type Listing } from '../types';
import { money } from '../utils/format';
import { SafetyRules } from '../components/SafetyRules';
import { MapBlock } from '../components/MapBlock';
import { useBookings } from '../context/BookingsContext';
import { useFavorites } from '../context/FavoriteContext';

const shortDorm = (d: string) => d.split(' (')[0];
const POINTS = [
  { id: 'hall', title: 'Холл 1 этажа / Вахта', hint: 'Рекомендуется кампусом' },
  { id: 'room', title: 'Комната покупателя', hint: 'Тест розетки на месте' },
  { id: 'custom', title: 'Свой вариант', hint: 'Уточнить в чате' },
];

type Meeting = { point: string; interval: string };
const DEFAULT_MEETING: Meeting = { point: 'hall', interval: 'Сегодня после пар (18:30 – 20:00)' };

export function CartPage({ onBack }: { onBack: () => void }) {
  const cart = useCart();
  const bookings = useBookings();
  const favorites = useFavorites();
  const [meet, setMeet] = useState<Record<string, Meeting>>({});
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  // One block per seller, as in the mockup
  const groups = useMemo(() => {
    const m = new Map<string, Listing[]>();
    cart.items.forEach((i) => m.set(i.seller.name, [...(m.get(i.seller.name) ?? []), i]));
    return [...m.entries()];
  }, [cart.items]);

  const chosen = cart.items.filter((i) => cart.selected.has(i.id));
  const paid = chosen.filter((i) => i.price > 0);
  const total = paid.reduce((sum, i) => sum + i.price, 0);
  const dorms = [...new Set(chosen.map((i) => shortDorm(i.dorm)))];
  const getMeet = (seller: string) => meet[seller] ?? DEFAULT_MEETING;
  const setMeeting = (seller: string, patch: Partial<Meeting>) =>
    setMeet((m) => ({ ...m, [seller]: { ...getMeet(seller), ...patch } }));

  const related = useListings(DEFAULT_FILTERS).items.filter((l) => !cart.has(l.id)).slice(0, 4);

  async function submit() {
    setStatus('sending');
    try {
      const sellers = new Set(chosen.map((i) => i.seller.name));
      const meetings = Object.fromEntries([...sellers].map((s) => [s, getMeet(s)]));
      await createOrder({ listingIds: chosen.map((i) => i.id), meetings, phone, comment });
      cart.removeMany(chosen.map((i) => i.id));
      chosen.forEach((l) => bookings.createFromListing(l, getMeet(l.seller.name).interval));
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done')
    return <section className="state"><h1>Заказ забронирован</h1><p>Продавцы получили уведомление. Вещи заморожены за вами на 24 часа.</p><button className="btn btn--green" onClick={onBack}>Вернуться в каталог</button></section>;

  if (!cart.items.length)
    return <section className="state"><h1>В корзине пока пусто</h1><p>Добавляйте вещи из каталога — оплата только при личной встрече.</p><button className="btn btn--green" onClick={onBack}>Перейти в каталог</button></section>;

  return (
    <>
      <nav className="crumbs"><button className="link" onClick={onBack}>Главная</button> / Корзина и оформление</nav>
      <h1 className="cart-title">Корзина и бронирование <span className="tag">{cart.items.length} товара</span></h1>
      <p className="muted">Оплата при личной встрече и осмотре в общежитии — никакой предоплаты и скрытых комиссий</p>

      <div className="cart-layout">
        <div className="cart-groups">
          {groups.map(([seller, lines]) => {
            const m = getMeet(seller);
            const s = lines[0].seller;
            return (
              <section className="group" key={seller}>
                <header className="group__head">
                  <i className="avatar">{seller[0]}</i>
                  <div><strong>{seller}</strong> <span className="tag">{s.institute}</span><br />
                    <small>★ {s.rating.toFixed(1)} ({s.reviews} сделок) · {lines[0].dorm}</small></div>
                  <button className="btn btn--ghost">Написать</button>
                </header>

                {lines.map((l) => (
                  <div className="line" key={l.id}>
                    <input type="checkbox" checked={cart.selected.has(l.id)} onChange={() => cart.toggle(l.id)} aria-label={`Выбрать: ${l.title}`} />
                    <div className="line__img">{l.image ? <img src={l.image} alt="" /> : '📦'}</div>
                    <div className="line__main">
                      <div className="card__row"><h3 className="card__title">{l.title}</h3><strong className="price">{money(l.price)}</strong></div>
                      <p className="muted">{l.description}</p>
                      <div className="line__actions">
                        <button className="link" onClick={() => favorites.toggle(l)}>{favorites.has(l.id) ? '♥ В избранном' : '♡ В избранное'}</button>
                        <button className="link" onClick={() => cart.remove(l.id)}>Удалить</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="meet">
                  <strong>Точка и время встречи ({shortDorm(lines[0].dorm)}):</strong>
                  <div className="meet__opts">
                    {POINTS.map((p) => (
                      <label key={p.id} className={m.point === p.id ? 'is-active' : ''}>
                        <input type="radio" name={`pt-${seller}`} checked={m.point === p.id} onChange={() => setMeeting(seller, { point: p.id })} />
                        <span><b>{p.title}</b><br /><small>{p.hint}</small></span>
                      </label>
                    ))}
                  </div>
                  <label className="meet__time">Удобный интервал осмотра:
                    <input value={m.interval} onChange={(e) => setMeeting(seller, { interval: e.target.value })} />
                  </label>
                </div>
              </section>
            );
          })}
          <SafetyRules />
        </div>
        
        <div className="side">
        <aside className="summary">
          <h2>Детали бронирования</h2>
          <dl>
            <dt>Выбрано товаров</dt><dd>{chosen.length} шт.</dd>
            <dt>Локации передачи</dt><dd>{dorms.join(', ') || '—'}</dd>
            <dt>Товары на покупку ({paid.length} шт.)</dt><dd>{money(total)}</dd>
            <dt>Товары «Даром» ({chosen.length - paid.length} шт.)</dt><dd>0 ₽</dd>
            <dt>Комиссия сервиса</dt><dd className="ok">0 ₽ (Бесплатно)</dd>
          </dl>
          <div className="total"><span>Итого к оплате:<br /><small>при личной встрече</small></span><strong>{money(total)}</strong></div>
          <div className="profile"><small>ВАШ ПРОФИЛЬ (TPU ID)</small><br /><b>{CURRENT_USER.name}</b><br />
            <small>{CURRENT_USER.institute} • {CURRENT_USER.dorm}, комн. {CURRENT_USER.room}</small></div>
          <label>Телефон / Telegram для связи<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (999) 000-00-00" /></label>
          <label>Комментарий продавцам<textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Например: подойду к вахте в 18:30, захвачу мелочь без сдачи..." /></label>
          
              {cart.items.length > 1 && (
        <button className="link" onClick={() => cart.removeMany(cart.items.map((i) => i.id))}>
          Очистить корзину
        </button>
      )}

          
          <button className="btn btn--green btn--wide" disabled={!chosen.length || !phone.trim() || status === 'sending'} onClick={submit}>
            {status === 'sending' ? 'Отправляем…' : `Забронировать заказ (${money(total)})`}
          </button>
          {status === 'error' && <p className="state--err">Не удалось отправить заказ. Попробуйте ещё раз.</p>}
          <p className="muted"><small>Продавцы получат уведомление. Вещи будут заморожены за вами на 24 часа.</small></p>
          <button className="link" onClick={onBack}>← Вернуться к покупкам в каталоге</button>
        </aside>
        <MapBlock dorms={dorms} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>Могут пригодиться в вашей комнате</h2>
          <div className="grid">
            {related.map((l) => (
              <article className="card" key={l.id}>
                <div className="card__body">
                  <strong className="price">{money(l.price)}</strong>
                  <h3 className="card__title">{l.title}</h3>
                  <div className="card__row"><small>{shortDorm(l.dorm)}</small><button className="btn btn--ghost" style={{ flex: 'none' }} aria-label={`Добавить: ${l.title}`} onClick={() => cart.add(l)}>+</button></div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
