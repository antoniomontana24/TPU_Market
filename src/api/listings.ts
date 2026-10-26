import { MOCK } from '../data/mock';
import type { Filters, Listing } from '../types';

export const PAGE_SIZE = 9;
export interface ListingsPage { items: Listing[]; total: number }

export async function fetchListings(f: Filters): Promise<ListingsPage> {
  await new Promise((r) => setTimeout(r, 200));
  const q = f.search.trim().toLowerCase();
  const rows = MOCK.filter((l) =>
    (!f.dorms.length || f.dorms.includes(l.dorm)) &&
    (!f.categories.length || f.categories.includes(l.category)) &&
    l.price >= f.priceMin && l.price <= f.priceMax &&
    (!f.offerTypes.length || f.offerTypes.includes(l.offerType)) &&
    (!f.conditions.length || f.conditions.includes(l.condition)) &&
    (!f.onlyAvailable || l.status !== 'reserved') &&
    l.title.toLowerCase().includes(q),
  );
  rows.sort((a, b) =>
    f.sort === 'cheap' ? a.price - b.price : f.sort === 'expensive' ? b.price - a.price : b.createdAt - a.createdAt,
  );
  const start = (f.page - 1) * PAGE_SIZE;
  return { items: rows.slice(start, start + PAGE_SIZE), total: rows.length };
}