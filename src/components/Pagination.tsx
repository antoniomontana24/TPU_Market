interface Props { page: number; total: number; pageSize: number; onPage: (p: number) => void }

export function Pagination({ page, total, pageSize, onPage }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  return (
    <div className="pager">
      <span>Показано {from}–{Math.min(page * pageSize, total)} из {total} объявлений</span>
      <nav aria-label="Страницы">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Назад">‹</button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button key={p} className={p === page ? 'is-active' : ''} onClick={() => onPage(p)}>{p}</button>
        ))}
        <button disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Вперёд">›</button>
      </nav>
    </div>
  );
}
