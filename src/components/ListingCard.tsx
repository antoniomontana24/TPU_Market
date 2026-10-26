import { Link } from 'react-router-dom';
import type { Listing } from '../types';
import { timeAgo } from '../utils/date';
import { money } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import { useChat } from '../context/ChatContext';

function Actions({ l }: { l: Listing }) {
  const cart = useCart();
  const chat = useChat();
  const inCart = cart.has(l.id);
  if (l.status === 'reserved')
    return <button className="btn btn--ghost btn--wide">Сообщить, если бронь спадет</button>;
  if (l.offerType === 'free')
    return <button className="btn btn--dark btn--wide" disabled={inCart} onClick={() => cart.add(l)}>{inCart ? 'В корзине' : 'Забрать даром'}</button>;
  return (
    <>
      <button className="btn btn--dark" onClick={() => chat.openForListing(l)}>Написать</button>
      <button className="btn btn--green" disabled={inCart} onClick={() => cart.add(l)}>
        {inCart ? 'В корзине' : l.status === 'bookable' ? 'Забронировать' : 'Купить'}
      </button>
    </>
  );
}

export function ListingCard({ l }: { l: Listing }) {
  
  const favorites = useFavorites();
  const inFav = favorites.has(l.id);

  return (
    <article className="card">
      <div className="card__img">
        <Link to={`/listing/${l.id}`} className="card__imglink" aria-label={l.title}>
          {l.image ? <img src={l.image} alt="" loading="lazy" /> : <span aria-hidden>📦</span>}
        </Link>
        <span className="chip">{l.dorm}</span>
        <button
          className={`heart ${inFav ? 'is-active' : ''}`}
          aria-label={inFav ? 'Убрать из избранного' : 'В избранное'}
          aria-pressed={inFav}
          onClick={() => favorites.toggle(l)}
        >
          {inFav ? '♥' : '♡'}
        </button>
      </div>
      <div className="card__body">
        <div className="card__row">
          <strong className="price">{l.price === 0 ? '0 ₽' : money(l.price)}</strong>
          {l.offerType === 'free' && <span className="tag tag--free">Бесплатно</span>}
          <time>{timeAgo(l.createdAt)}</time>
        </div>
        <h3 className="card__title"><Link to={`/listing/${l.id}`} className="plain">{l.title}</Link></h3>
        <p className="card__desc">{l.description}</p>
        <div className="card__row">
          <span className="seller">
            <i className="avatar">{l.seller.name[0]}</i>
            {l.seller.name} <small>★ {l.seller.rating.toFixed(1)} ({l.seller.reviews})</small>
          </span>
          <span className="tag">{l.seller.institute}</span>
        </div>
        <div className="card__actions"><Actions l={l} /></div>
      </div>
    </article>
  );
}