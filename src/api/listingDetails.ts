import { MOCK } from '../data/mock';
import type { Condition, Listing } from '../types';

export interface Review { id: number; author: string; unit: string; stars: number; text: string; when: string; subject: string }
export interface Spec { label: string; value: string; note: string }
export interface SellerInfo { program: string; deals: number; reviewsCount: number; emailMasked: string; address: string; since: string }
export interface ListingDetails extends Listing {
  sku: string; images: string[]; longDescription: string; pickupNote: string;
  moderation: string; specs: Spec[]; sellerInfo: SellerInfo; reviews: Review[];
}

const CONDITION_RU: Record<Condition, string> = { new: 'Новое', excellent: 'Отличное', good: 'Хорошее', parts: 'На запчасти' };

// Richer sample data for listing #1 (matches the mockup). The backend will send all of this.
const RICH: Record<number, Partial<ListingDetails>> = {
  1: {
    longDescription: 'Продаю в связи с выпуском из магистратуры ИШПР. Работает безупречно, быстро разогревает, тарелка крутится без скрипа. Внутреннее покрытие EasyClean чистится обычной салфеткой за пару секунд.',
    moderation: 'Мощность электроприбора (800W) и габариты полностью соответствуют регламенту пожарной безопасности кампуса.',
    sellerInfo: { program: 'Студент ТПУ (ИШПР, 2 курс маг.)', deals: 24, reviewsCount: 19, emailMasked: 'd**@tpu.ru', address: 'ул. Вершинина, 33, комн. 412', since: 'сентября 2023 года' },
    reviews: [
      { id: 1, author: 'Максим В.', unit: 'ИЯТШ • Общ. 13', stars: 5, text: 'Состояние было точь-в-точь как в описании. Проверили вместе в комнате перед оплатой, всё чётко и пунктуально!', when: '2 недели назад', subject: 'Покупка чайника Tefal' },
      { id: 2, author: 'Алина К.', unit: 'ИШЭ • Общ. 16', stars: 5, text: 'Помог донести конспекты и настольную лампу прямо до 16 общежития. Очень вежливый продавец.', when: '1 месяц назад', subject: 'Настольная лампа и лекции' },
    ],
  },
};

export async function fetchListingDetails(id: number, pool: Listing[] = MOCK): Promise<ListingDetails | null> {
  await new Promise((r) => setTimeout(r, 200));
  const l = pool.find((x) => x.id === id);
  if (!l) return null;
  const base: ListingDetails = {
    ...l,
    sku: `ТПУ-13-${8940 + l.id}`,
    images: l.image ? [l.image] : [],
    longDescription: l.description,
    pickupNote: `Самовывоз: ${l.dorm}. Могу донести до вахты или до вашей комнаты в этом же общежитии.`,
    moderation: 'Запрещённые правилами проживания предметы отсутствуют.',
    specs: [
      { label: 'Состояние', value: CONDITION_RU[l.condition], note: 'Без посторонних запахов, чистая' },
      { label: 'Тип сделки', value: l.offerType === 'free' ? 'Отдам даром' : 'Прямая продажа', note: 'Передача из рук в руки без скрытых наценок' },
      { label: 'Категория', value: l.category, note: 'Оснащение студенческой комнаты' },
    ],
    sellerInfo: { program: `Студент ТПУ (${l.seller.institute})`, deals: l.seller.reviews, reviewsCount: l.seller.reviews, emailMasked: '***@tpu.ru', address: l.dorm, since: '2024 года' },
    reviews: [],
  };
  return { ...base, ...RICH[id] };
}
