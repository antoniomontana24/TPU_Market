import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Listing } from '../types';

interface FavoritesCtx {
  items: Listing[];
  has: (id: number) => boolean;
  add: (l: Listing) => void;
  remove: (id: number) => void;
  toggle: (l: Listing) => void;
}

const Ctx = createContext<FavoritesCtx | null>(null);
const KEY = 'studobmen.favorites';

function load(): Listing[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Listing[]>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* */ }
  }, [items]);

  const value: FavoritesCtx = {
    items,
    has: (id) => items.some((i) => i.id === id),
    add: (l) => setItems((p) => p.some((i) => i.id === l.id) ? p : [...p, l]),
    remove: (id) => setItems((p) => p.filter((i) => i.id !== id)),
    toggle: (l) => setItems((p) => p.some((i) => i.id === l.id) ? p.filter((i) => i.id !== l.id) : [...p, l]),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites(): FavoritesCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return c;
}