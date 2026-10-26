import { CATEGORIES, DORMS } from '../data/mock';
import type { Condition, Filters, OfferType } from '../types';

interface Props { filters: Filters; onChange: (patch: Partial<Filters>) => void; onReset: () => void }

const OFFERS: [OfferType, string][] = [['sale', 'Продажа'], ['rent', 'Аренда на семестр / сессию'], ['free', 'Отдам даром']];
const CONDITIONS: [Condition, string][] = [['new', 'Новое / Как из магазина'], ['excellent', 'Отличное'], ['good', 'Хорошее (с следами быта)'], ['parts', 'На запчасти / восстановление']];

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export function FilterSidebar({ filters: f, onChange, onReset }: Props) {
  return (
    <aside className="filters">
      <div className="filters__head">
        <h2>Фильтры</h2>
        <button className="link" onClick={onReset}>Сбросить все</button>
      </div>

      <fieldset>
        <legend>Общежитие</legend>
        <div className="dorm-chips">
          {DORMS.map((d) => (
            <button key={d} className={f.dorms.includes(d) ? 'is-active' : ''} onClick={() => onChange({ dorms: toggle(f.dorms, d) })}>{d}</button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Категория</legend>
        {CATEGORIES.map((c) => (
          <label key={c}><input type="checkbox" checked={f.categories.includes(c)} onChange={() => onChange({ categories: toggle(f.categories, c) })} /> {c}</label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Цена, ₽</legend>
        <div className="range">
          <input type="number" min={0} value={f.priceMin} onChange={(e) => onChange({ priceMin: Number(e.target.value) || 0 })} aria-label="Цена от" />
          <span>—</span>
          <input type="number" min={0} value={f.priceMax} onChange={(e) => onChange({ priceMax: Number(e.target.value) || 0 })} aria-label="Цена до" />
        </div>
        <div className="quick">
          <button onClick={() => onChange({ priceMin: 0, priceMax: 500 })}>до 500 ₽</button>
          <button onClick={() => onChange({ priceMin: 0, priceMax: 2000 })}>до 2 000 ₽</button>
          <button onClick={() => onChange({ offerTypes: ['free'] })}>Бесплатно</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Тип предложения</legend>
        {OFFERS.map(([v, label]) => (
          <label key={v}><input type="checkbox" checked={f.offerTypes.includes(v)} onChange={() => onChange({ offerTypes: toggle(f.offerTypes, v) })} /> {label}</label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Состояние</legend>
        {CONDITIONS.map(([v, label]) => (
          <label key={v}><input type="checkbox" checked={f.conditions.includes(v)} onChange={() => onChange({ conditions: toggle(f.conditions, v) })} /> {label}</label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Статус сделки</legend>
        <label><input type="checkbox" checked={f.onlyAvailable} onChange={(e) => onChange({ onlyAvailable: e.target.checked })} /> Без забронированных</label>
      </fieldset>
    </aside>
  );
}