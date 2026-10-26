import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useNotifications } from '../context/NotificationsContext';
import { timeAgo } from '../utils/date';
import type { NotificationType } from '../types';

const ICON: Record<NotificationType, string> = { message: '💬', booking: '⏳', purchase: '✅', moderation: '🛡️', system: '🔔' };
const FILTERS: [NotificationType | 'all', string][] = [['all', 'Все'], ['message', 'Сообщения'], ['booking', 'Брони'], ['purchase', 'Покупки'], ['moderation', 'Модерация'], ['system', 'Система']];

export default function NotificationsPage() {
  const { items, unread, markRead, markAllRead, clear } = useNotifications();
  const chat = useChat();
  const nav = useNavigate();
  const [tab, setTab] = useState<NotificationType | 'all'>('all');
  const rows = useMemo(() => (tab === 'all' ? items : items.filter((i) => i.type === tab)), [items, tab]);

  const onItem = (id: string, threadId?: string, link?: string) => {
    markRead(id);
    if (threadId) chat.open(threadId);
    else if (link) nav(link);
  };

  return (
    <>
      <nav className="crumbs"><Link to="/">Каталог</Link> / <Link to="/profile">Кабинет</Link> / Уведомления</nav>
      <div className="card__row"><h1 className="cart-title">Уведомления {unread > 0 && <span className="tag tag--free">{unread} новых</span>}</h1>
        <div className="ml-card__actions">
          {unread > 0 && <button className="btn btn--ghost" onClick={markAllRead}>Прочитать все</button>}
          {items.length > 0 && <button className="link link--danger" onClick={clear}>Очистить ленту</button>}
        </div></div>

      <div className="pager-tabs">{FILTERS.map(([v, l]) => (
        <button key={v} className={tab === v ? 'is-active' : ''} onClick={() => setTab(v)}>{l}</button>))}</div>

      {rows.length === 0 && <p className="state">В этом разделе пусто.</p>}
      <div className="notif-list">
        {rows.map((n) => (
          <button key={n.id} className={`notif ${n.read ? '' : 'is-new'}`} onClick={() => onItem(n.id, n.threadId, n.link)}>
            <span className="notif__ico" aria-hidden>{ICON[n.type]}</span>
            <span className="notif__txt"><b>{n.title}</b><small>{n.body}</small><time>{timeAgo(n.createdAt)}</time></span>
            {!n.read && <span className="notif__dot" />}
          </button>
        ))}
      </div>
    </>
  );
}