import { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { money } from '../utils/format';

export function ChatWidget() {
  const { threads, activeId, typingId, close, send } = useChat();
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const t = threads.find((x) => x.id === activeId);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [t?.messages.length, typingId, activeId]);
  if (!t) return null;

  const submit = () => { send(t.id, text); setText(''); };

  return (
    <section className="chatw" role="dialog" aria-label={`Чат с ${t.sellerName}`}>
      <header className="chatw__head">
        <div className="chatw__item">
          <div className="chatw__thumb">{t.listingImage ? <img src={t.listingImage} alt="" /> : '📦'}</div>
          <div><strong>{t.listingTitle}</strong><br /><small>{money(t.listingPrice)} · {t.sellerName}</small></div>
        </div>
        <button className="chatw__x" onClick={close} aria-label="Закрыть чат">✕</button>
      </header>

      <div className="chatw__log">
        {t.messages.length === 0 && <p className="muted" style={{ textAlign: 'center', padding: 12 }}>Начните диалог — продавец отвечает в среднем за 5 минут.</p>}
        {t.messages.map((m) => (
          <div key={m.id} className={`chatw__msg chatw__msg--${m.author}`}>
            <span>{m.text}</span><time>{new Date(m.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</time>
          </div>
        ))}
        {typingId === t.id && <div className="chatw__msg chatw__msg--seller chatw__typing"><i /><i /><i /></div>}
        <div ref={endRef} />
      </div>

      <footer className="chatw__foot">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Сообщение продавцу…" aria-label="Текст сообщения" />
        <button className="btn btn--green" onClick={submit} disabled={!text.trim()}>➤</button>
      </footer>
    </section>
  );
}