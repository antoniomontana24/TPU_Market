import { useMemo } from 'react';
import { PAGE_SIZE } from '../api/listings';
import { useListingsData } from '../context/ListingsContext';
import type { Filters } from '../types';

const PUBLISHED = new Set(['available', 'reserved', 'bookable']);

export function useListings(filters: Filters) {
  const { all } = useListingsData();

  return useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    let rows = all.filter((l) =>
      PUBLISHED.has(l.status) &&
      (!filters.dorms.length || filters.dorms.includes(l.dorm)) &&
      (!filters.categories.length || filters.categories.includes(l.category)) &&
      l.price >= filters.priceMin && l.price <= filters.priceMax &&
      (!filters.offerTypes.length || filters.offerTypes.includes(l.offerType)) &&
      (!filters.conditions.length || filters.conditions.includes(l.condition)) &&
      (!filters.onlyAvailable || l.status !== 'reserved') &&
      l.title.toLowerCase().includes(q),
    );
    rows = [...rows].sort((a, b) =>
      filters.sort === 'cheap' ? a.price - b.price
      : filters.sort === 'expensive' ? b.price - a.price
      : b.createdAt - a.createdAt,
    );
    const start = (filters.page - 1) * PAGE_SIZE;
    return { items: rows.slice(start, start + PAGE_SIZE), total: rows.length, loading: false, error: null as string | null };
  }, [all, filters]);
}