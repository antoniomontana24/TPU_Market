import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Listing } from '../types';

interface CartCtx {
  items: Listing[];
  selected: Set<number>;
  has: (id: number) => boolean;
  add: (l: Listing) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  removeMany: (ids: number[]) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'studobmen.cart';

function load(): Listing[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Listing[]>(load);
  const [unselected, setUnselected] = useState<Set<number>>(new Set()); // everything is selected by default

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
  }, [items]);

  const value: CartCtx = {
    items,
    selected: new Set(items.filter((i) => !unselected.has(i.id)).map((i) => i.id)),
    has: (id) => items.some((i) => i.id === id),
    add: (l) => setItems((p) => (p.some((i) => i.id === l.id) ? p : [...p, l])),
    remove: (id) => setItems((p) => p.filter((i) => i.id !== id)),
    removeMany: (ids) => setItems((p) => p.filter((i) => !ids.includes(i.id))),
    toggle: (id) => setUnselected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside <CartProvider>');
  return c;
}
