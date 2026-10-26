import type { Spec } from '../api/listingDetails';

export function Specs({ specs }: { specs: Spec[] }) {
  return (
    <section className="panel">
      <div className="card__row"><h2>Характеристики и соответствие правилам</h2><span className="tag tag--free">Стандарт ТПУ 2024/25</span></div>
      <div className="specs">
        {specs.map((s) => (
          <div key={s.label} className="specs__item">
            <small>{s.label.toUpperCase()}</small>
            <strong>{s.value}</strong>
            <small>{s.note}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
