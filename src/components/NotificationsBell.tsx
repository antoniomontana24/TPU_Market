import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useNotifications } from '../context/NotificationsContext';
import { timeAgo } from '../utils/date';
import type { NotificationType } from '../types';

const ICON: Record<NotificationType, string> = { message: '💬', booking: '⏳', purchase: '✅', moderation: '🛡️', system: '🔔' };

export function NotificationBell() {
  const { items, unread, markRead, markAllRead } = useNotifications();
  const chat = useChat();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const onItem = (id: string, threadId?: string, link?: string) => {
    markRead(id);
    if (threadId) { chat.open(threadId); setOpen(false); return; }
    if (link) { nav(link); setOpen(false); }
  };

  return (
    <div className="bell-wrap">
      <button className="btn btn--ghost cart-btn bell" aria-label="Уведомления" onClick={() => setOpen((o) => !o)}>
        🔔 {unread > 0 && <span className="bell__dot">{unread}</span>}
      </button>
      {open && (
        <>
          <div className="bell__scrim" onClick={() => setOpen(false)} />
          <div className="bell__panel">
            <div className="bell__head"><b>Уведомления</b>
              {unread > 0 && <button className="link" onClick={markAllRead}>Прочитать все</button>}</div>
            {items.length === 0 && <p className="state" style={{ padding: 16 }}>Пока тихо.</p>}
            {items.slice(0, 6).map((n) => (
              <button key={n.id} className={`bell__item ${n.read ? '' : 'is-new'}`} onClick={() => onItem(n.id, n.threadId, n.link)}>
                <span className="bell__ico" aria-hidden>{ICON[n.type]}</span>
                <span className="bell__txt"><b>{n.title}</b><small>{n.body}</small><time>{timeAgo(n.createdAt)}</time></span>
                {!n.read && <span className="bell__unread" />}
              </button>
            ))}
            <button className="link bell__all" onClick={() => { setOpen(false); nav('/notifications'); }}>Показать все →</button>
          </div>
        </>
      )}
    </div>
  );
}