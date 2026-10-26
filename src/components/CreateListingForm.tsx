import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, CURRENT_USER, DORMS } from '../data/mock';
import { useListingsData } from '../context/ListingsContext';
import type { Condition, Listing, NewListingInput, OfferType, Status } from '../types';

const OFFERS: [OfferType, string][] = [['sale', 'Продажа'], ['rent', 'Аренда'], ['free', 'Даром']];
const CONDS: [Condition, string][] = [['new', 'Новое'], ['excellent', 'Отличное'], ['good', 'Хорошее'], ['parts', 'Удовлетворит.']];

interface Props { initial?: Listing }

export function CreateListingForm({ initial }: Props) {
  const ctx = useListingsData();
  const nav = useNavigate();
  const editing = !!initial;

  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [offerType, setOfferType] = useState<OfferType>(initial?.offerType ?? 'sale');
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [condition, setCondition] = useState<Condition>(initial?.condition ?? 'good');
  const [dorm, setDorm] = useState(initial?.dorm ?? DORMS[0]);
  const [image, setImage] = useState<string | undefined>(initial?.image);
  const [checked, setChecked] = useState(false); // «пройдено AI»

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setImage(URL.createObjectURL(f));
  };

  const submit = (status: Status) => {
    const input: NewListingInput = {
      title: title.trim() || 'Без названия',
      description: description.trim(),
      price: offerType === 'free' ? 0 : price,
      offerType, condition, category, dorm, image, status,
    };
    if (editing && initial) ctx.update(initial.id, input);
    else ctx.add(input);
    setChecked(true);
    setTimeout(() => nav('/profile'), 1200); // даём увидеть баннер проверки
  };

  return (
    <section className="panel form">
      <div className="card__row"><h2>{editing ? 'Редактирование объявления' : 'Новое объявление'}</h2>
        <span className="tag">Шаг 1 из 1</span></div>

      <label className="field">Название товара или услуги*
        <input value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} placeholder="Учебник по физике (Иродов) + методичка ТПУ" />
        <small className="muted">{title.length}/80</small>
      </label>

      <label className="field">Описание
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Состояние, комплектация, почему отдаёте…" />
      </label>

      <div className="form__grid">
        <label className="field">Категория*
          <select value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="field">Локация передачи*
          <select value={dorm} onChange={(e) => setDorm(e.target.value)}>{DORMS.map((d) => <option key={d}>{d}</option>)}</select>
        </label>
      </div>

      <fieldset className="field"><legend>Тип предложения</legend>
        <div className="chips">{OFFERS.map(([v, l]) => (
          <label key={v} className={offerType === v ? 'chip-btn is-active' : 'chip-btn'}>
            <input type="radio" name="offer" checked={offerType === v} onChange={() => setOfferType(v)} /> {l}
          </label>))}
        </div>
      </fieldset>

      <div className="form__grid">
        <label className="field">Стоимость (₽)*
          <input type="number" min={0} disabled={offerType === 'free'} value={offerType === 'free' ? 0 : price} onChange={(e) => setPrice(Number(e.target.value) || 0)} />
          {offerType === 'free' && <small className="muted">Для «Даром» цена 0 ₽</small>}
        </label>
        <fieldset className="field"><legend>Состояние вещи</legend>
          <div className="chips">{CONDS.map(([v, l]) => (
            <label key={v} className={condition === v ? 'chip-btn is-active' : 'chip-btn'}>
              <input type="radio" name="cond" checked={condition === v} onChange={() => setCondition(v)} /> {l}
            </label>))}
          </div>
        </fieldset>
      </div>

      <label className="field">Фотографии товара
        <input type="file" accept="image/*" onChange={onFile} />
        {image && <img className="form__preview" src={image} alt="Превью" />}
      </label>

      {checked && (
        <div className="ai-ok"><b>МГНОВЕННО · AI‑проверка ТПУ пройдена успешно</b>
          <small>Текст корректен, запрещённые предметы и нарушения распорядка не обнаружены.</small></div>
      )}

      <div className="form__actions">
        <button className="btn btn--ghost" onClick={() => nav(-1)}>Отмена</button>
        <button className="btn btn--ghost" disabled={checked} onClick={() => submit('draft')}>Сохранить черновик</button>
        <button className="btn btn--green" disabled={checked} onClick={() => submit('moderation')}>Опубликовать в кампусе</button>
      </div>
      <p className="muted"><small>Публикация доступна авторизованным жителям кампуса ({CURRENT_USER.dorm}).</small></p>
    </section>
  );
}