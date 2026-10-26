import { Link } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { money } from '../utils/format';
import { timeAgo } from '../utils/date';

export default function ChatsPage() {
  const { threads, open } = useChat();
  return (
    <>
      <nav className="crumbs"><Link to="/">Каталог</Link> / <Link to="/profile">Кабинет</Link> / Чаты</nav>
      <h1 className="cart-title">Сообщения <span className="tag">{threads.length} диалогов</span></h1>
      {threads.length === 0 && <p className="state">Диалогов нет. Напишите продавцу с карточки товара.</p>}
      <div className="chat-list">
        {threads.map((t) => {
          const last = t.messages[t.messages.length - 1];
          return (
            <button key={t.id} className="chat-row" onClick={() => open(t.id)}>
              <i className="avatar avatar--lg">{t.sellerAvatar}</i>
              <div className="chat-row__main">
                <div className="card__row"><b>{t.sellerName}</b><time>{timeAgo(t.updatedAt)}</time></div>
                <small className="muted">{t.listingTitle} · {money(t.listingPrice)}</small>
                <p>{last ? `${last.author === 'me' ? 'Вы: ' : ''}${last.text}` : 'Нет сообщений'}</p>
              </div>
              {t.unread > 0 && <span className="chat-row__badge">{t.unread}</span>}
            </button>
          );
        })}
      </div>
    </>
  );
}