import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import { CURRENT_USER } from '../data/mock';
import { NotificationBell } from './NotificationsBell';
 import { ChatWidget } from './ChatWidget';
 import { useChat } from '../context/ChatContext';

export function Layout() {
  const chat = useChat();
  const cart = useCart();
  const favorites = useFavorites();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();

  const onSearch = (v: string) =>
    pathname === '/' ? setParams(v ? { q: v } : {}, { replace: true }) : nav(`/?q=${encodeURIComponent(v)}`);

  return (
    <>
      <header className="header">
        <div className="wrap header__in">
          <Link className="logo" to="/"><b>СТУДОБМЕН</b> <small>Маркетплейс общежитий</small></Link>
          <input className="search" type="search" placeholder="Поиск вещей, книг, техники по кампусу..." value={params.get('q') ?? ''} onChange={(e) => onSearch(e.target.value)} />
          <Link className="btn btn--green" to="/profile/new">+ Подать объявление</Link>
          <Link className="btn btn--ghost cart-btn" to="/favorites" aria-label="Избранное">♥ {favorites.items.length}</Link>
          <Link className="btn btn--ghost cart-btn" to="/cart" aria-label="Корзина"> {cart.items.length}</Link>
          <NotificationBell />
          <Link className="btn btn--ghost cart-btn" to="/chats" aria-label="Сообщения">💬 {chat.unread > 0 && <span className="bell__dot">{chat.unread}</span>}</Link>
          <Link className="user plain" to="/profile">{CURRENT_USER.name.split(' ')[0]} {CURRENT_USER.name.split(' ')[1]?.[0]}.</Link>
          </div>
      </header>
      <main className="wrap"><Outlet /></main>
      <ChatWidget />
      <footer className="footer">
        <div className="wrap">© 2026 ТПУ Маркет. Создано студентами Томского политехнического университета.</div>
      </footer>
    </>
  );
}