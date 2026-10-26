import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { INIT_THREADS } from '../data/mock';
import { uid } from '../utils/id';
import { useListingsData } from './ListingsContext';
import { useNotifications } from './NotificationsContext';
import type { ChatMessage, ChatThread, Listing } from '../types';

const REPLIES = [
  'Привет! Да, ещё свободно. Могу спуститься к вахте после пар 🙂',
  'Состояние отличное, включим в розетку на посту дежурного, как по регламенту.',
  'Готов уступить 100 ₽, если заберёшь сегодня до 20:00.',
  'Напиши, когда будешь в корпусе — выйду через 5 минут.',
  'Оплата при встрече, предоплата не нужна. Договорились?',
];
const pick = () => REPLIES[Math.floor(Math.random() * REPLIES.length)];

interface ChatCtx {
  threads: ChatThread[];
  activeId: string | null;
  typingId: string | null;
  unread: number;
  openForListing: (l: Listing) => void;
  openByListingId: (id: number) => void;
  open: (threadId: string) => void;
  close: () => void;
  send: (threadId: string, text: string) => void;
}

const Ctx = createContext<ChatCtx | null>(null);
const KEY = 'studobmen.chats';

function load(): ChatThread[] {
  try { const r = JSON.parse(localStorage.getItem(KEY) ?? 'null'); return Array.isArray(r) ? r : INIT_THREADS; }
  catch { return INIT_THREADS; }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { all } = useListingsData();
  const notif = useNotifications();
  const [threads, setThreads] = useState<ChatThread[]>(load);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [typingId, setTypingId] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  activeRef.current = activeId;

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(threads)); } catch { /* noop */ } }, [threads]);

  const ensureThread = useCallback((l: Listing): string => {
    const existing = threads.find((t) => t.listingId === l.id);
    if (existing) return existing.id;
    const id = uid('t');
    const t: ChatThread = {
      id, listingId: l.id, listingTitle: l.title, listingPrice: l.price, listingImage: l.image,
      sellerName: l.seller.name, sellerAvatar: l.seller.name[0] ?? '?', messages: [], updatedAt: Date.now(), unread: 0,
    };
    setThreads((p) => [t, ...p]);
    return id;
  }, [threads]);

  const markOpen = useCallback((id: string) => {
    setThreads((p) => p.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
    notif.markByThread(id);
  }, [notif]);

  const open = useCallback((id: string) => { setActiveId(id); markOpen(id); }, [markOpen]);
  const openForListing = useCallback((l: Listing) => { const id = ensureThread(l); setActiveId(id); markOpen(id); }, [ensureThread, markOpen]);
  const openByListingId = useCallback((lid: number) => {
    const l = all.find((x) => x.id === lid);
    if (l) openForListing(l);
  }, [all, openForListing]);
  const close = useCallback(() => setActiveId(null), []);

  const send = useCallback((threadId: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const mine: ChatMessage = { id: uid('m'), author: 'me', text: clean, createdAt: Date.now() };
    setThreads((p) => p.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, mine], updatedAt: mine.createdAt } : t)));
    setTypingId(threadId);
    window.setTimeout(() => {
      const reply: ChatMessage = { id: uid('m'), author: 'seller', text: pick(), createdAt: Date.now() };
      const isActive = activeRef.current === threadId;
      setThreads((p) => p.map((t) => (t.id === threadId
        ? { ...t, messages: [...t.messages, reply], updatedAt: reply.createdAt, unread: isActive ? 0 : t.unread + 1 }
        : t)));
      setTypingId(null);
      if (!isActive) {
        const t = threads.find((x) => x.id === threadId);
        notif.push({ type: 'message', title: `${t?.sellerName ?? 'Продавец'} ответил вам`, body: reply.text, threadId, listingId: t?.listingId, link: '/chats' });
      }
    }, 1100);
  }, [notif, threads]);

  const unread = threads.reduce((s, t) => s + t.unread, 0);
  const value: ChatCtx = { threads, activeId, typingId, unread, openForListing, openByListingId, open, close, send };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChat(): ChatCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useChat must be used inside <ChatProvider>');
  return c;
}