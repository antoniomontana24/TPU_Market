import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../api/listings';
import { useListings } from '../hooks/useListings';
import { DEFAULT_FILTERS, type Filters, type SortKey } from '../types';
import { FilterSidebar } from '../components/FilterSidebar';
import { ListingCard } from '../components/ListingCard';
import { Pagination } from '../components/Pagination';

export default function CatalogPage() {
  const [params] = useSearchParams();
  const [state, setState] = useState<Filters>(DEFAULT_FILTERS);
  const q = params.get('q') ?? '';
  const filters = useMemo(() => ({ ...state, search: q }), [state, q]);
  const { items, total, loading, error } = useListings(filters);
  const update = (patch: Partial<Filters>) => setState((f) => ({ ...f, page: 1, ...patch }));

  return (
    <>
      <div className="layout">
        <FilterSidebar filters={filters} onChange={update} onReset={() => setState(DEFAULT_FILTERS)} />
        <section>
          <div className="bar">
            <h1>Товары в кампусе <small>найдено {total}</small></h1>
            <select value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} aria-label="Сортировка">
              <option value="new">Сначала свежие</option>
              <option value="cheap">Сначала дешевые</option>
              <option value="expensive">Сначала дорогие</option>
            </select>
          </div>
          {error && <p className="state state--err">{error}</p>}
          {!error && !loading && total === 0 && <p className="state">Ничего не найдено. Измените фильтры или поиск.</p>}
          <div className={`grid ${loading ? 'is-loading' : ''}`}>
            {items.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
          <Pagination page={filters.page} total={total} pageSize={PAGE_SIZE} onPage={(page) => setState((f) => ({ ...f, page }))} />
        </section>
      </div>
    </>
  );
}