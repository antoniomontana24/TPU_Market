import { Link, useNavigate } from 'react-router-dom';
import { useListingsData } from '../context/ListingsContext';
import { money } from '../utils/format';
import { timeAgo } from '../utils/date';
import type { Listing, Status } from '../types';

const BADGE: Record<Status, [string, string]> = {
  available: ['АКТИВНО', 'badge--active'],
  bookable:  ['ДОСТУПНО', 'badge--active'],
  reserved:  ['БРОНЬ',   'badge--hold'],
  moderation:['МОДЕРАЦИЯ','badge--mod'],
  sold:      ['ПРОДАНО', 'badge--sold'],
  draft:     ['ЧЕРНОВИК','badge--sold'],
};

function Row({ l }: { l: Listing }) {
  const ctx = useListingsData();
  const nav = useNavigate();
  const [label, cls] = BADGE[l.status];
  const editable = l.status !== 'sold';

  return (
    <article className="ml-card">
      <div className="ml-card__img">{l.image ? <img src={l.image} alt="" /> : '📦'}<span className={`badge ${cls}`}>{label}</span></div>
      <div className="ml-card__main">
        <div className="card__row"><Link to={`/listing/${l.id}`} className="plain"><h3 className="card__title">{l.title}</h3></Link>
          <strong className="price">{l.price === 0 ? '0 ₽' : money(l.price)}</strong></div>
        <p className="muted">{l.description || '—'}</p>
        <small className="muted">{l.dorm.split(' (')[0]} · обновлено {timeAgo(l.createdAt)}</small>
        <div className="ml-card__actions">
          {editable && <button className="btn btn--ghost" onClick={() => nav(`/profile/new?edit=${l.id}`)}>Редактировать</button>}
          {l.status === 'draft' && <button className="btn btn--green" onClick={() => ctx.updateStatus(l.id, 'moderation')}>Отправить на модерацию</button>}
          {l.status === 'moderation' && <>
            <button className="btn btn--green" onClick={() => ctx.updateStatus(l.id, 'available')}>Принять (демо)</button>
            <button className="btn btn--ghost" onClick={() => ctx.updateStatus(l.id, 'draft')}>Вернуть в черновики</button>
          </>}
          {l.status === 'available' && <button className="btn btn--ghost" onClick={() => ctx.updateStatus(l.id, 'draft')}>Снять с публикации</button>}
          {l.status === 'reserved' && <button className="btn btn--ghost" onClick={() => ctx.updateStatus(l.id, 'available')}>Отменить бронь</button>}
          <button className="link link--danger" onClick={() => ctx.remove(l.id)}>Удалить</button>
        </div>
      </div>
    </article>
  );
}

export function MyListingsTab() {
  const { mine } = useListingsData();
  if (!mine.length) return <p className="state">У вас пока нет объявлений. <b>+ Подать объявление</b> в шапке.</p>;
  return <div className="ml-list">{mine.map((l) => <Row key={l.id} l={l} />)}</div>;
}