import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import { money } from '../utils/format';
import type { ListingDetails } from '../api/listingDetails';
import { useChat } from '../context/ChatContext';

export function BuyBox({ l }: { l: ListingDetails }) {
  const chat = useChat();
  const cart = useCart();
  const favorites = useFavorites();
  const nav = useNavigate();
  const reserved = l.status === 'reserved';
  const inCart = cart.has(l.id);
  const inFav = favorites.has(l.id);
  const checkout = () => { cart.add(l); nav('/cart'); };

  return (
    <section className="buybox">
      <div className="card__row">
        <span className={`tag ${reserved ? '' : 'tag--free'}`}>{reserved ? 'Забронировано' : 'Доступно к бронированию'}</span>
        <small>Арт: {l.sku}</small>
      </div>
      <h1>{l.title}</h1>
      <div className="buybox__price"><strong>{money(l.price)}</strong> <span className="tag">Без комиссии</span></div>
      <p className="muted"><small>Оплата переводом через СБП или наличными при получении</small></p>
      <button className="btn btn--green btn--wide" disabled={reserved} onClick={checkout}>Оформить заказ</button>
      <button className="btn btn--ghost btn--wide" disabled={reserved} onClick={checkout}>Забронировать на 24 часа (без предоплаты)</button>
      <div className="buybox__row">
        <button className="btn btn--ghost" disabled={inCart} onClick={() => cart.add(l)}>{inCart ? 'В корзине' : 'В корзину'}</button>
        <button
          className="btn btn--ghost"
          aria-pressed={inFav}
          onClick={() => favorites.toggle(l)}
        >
          {inFav ? '♥ В избранном' : '♡ В избранное'}
        </button>
      </div>
      <button className="btn btn--dark btn--wide" onClick={() => chat.openForListing(l)}>Написать продавцу в чат ТПУ</button>
      <div className="buybox__row"><small>Ответ за 5 минут</small><small>Гарантия возврата 3 дня</small></div>
    </section>
  );
}

export function DealTerms() {
  return (
    <section className="terms">
      <h2>Условия сделки и безопасность</h2>
      <ul>
        <li><b>Оплата при встрече:</b> перевод через СБП или наличные только после вашего осмотра.</li>
        <li><b>Проверка на месте:</b> можно включить в розетку на посту дежурного/вахтера.</li>
        <li><b>Соседский манибэк:</b> если в течение 3 дней выявится скрытый дефект, продавец вернет 100% средств.</li>
      </ul>
    </section>
  );
}