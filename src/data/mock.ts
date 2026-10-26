import type { Listing, AppNotification, ChatThread } from '../types';

export const CURRENT_USER = { name: 'Алексей Соколов', institute: 'ИШИТР', dorm: 'Общ. №13', room: '412' };


const ago = (min: number) => Date.now() - min * 60_000;
const s = (name: string, rating: number, reviews: number, institute: string) => ({ name, rating, reviews, institute });

export const DORMS = ['Общ. №13 (Вершинина, 33)', 'Общ. №12', 'Общ. №16', 'Общ. №19 (Кирова)', 'Общ. №17', 'Общ. №1', 'Общ. №7'];
export const CATEGORIES = ['Электроника и ПК', 'Учебники и методички', 'Бытовая техника', 'Мебель для комнат', 'Кухня и посуда', 'Отдам даром (0 ₽)'];


export const MOCK: Listing[] = [
  { id: 1, title: 'Микроволновая печь LG Grill', description: 'Чистая, без запахов, тарелка целая, греет отлично.', price: 2200, offerType: 'sale', condition: 'excellent', category: 'Бытовая техника', dorm: DORMS[0], status: 'available', createdAt: ago(10), seller: s('Даниил К.', 4.9, 18, 'TPU ID') },
  { id: 2, title: 'Задачник по ТОЭ (Демирчян)', description: 'Полный комплект для сдачи экзамена в ЭНИН.', price: 350, offerType: 'sale', condition: 'good', category: 'Учебники и методички', dorm: DORMS[3], status: 'reserved', createdAt: ago(25), seller: s('Екатерина В.', 5, 9, 'ИШЭ ТПУ') },
  { id: 3, title: 'Настольная лампа LED с USB', description: 'Светит в 3 режимах. Отдам первокурснику за шоколадку.', price: 0, offerType: 'free', condition: 'good', category: 'Отдам даром (0 ₽)', dorm: DORMS[2], status: 'available', createdAt: ago(60), seller: s('Максим Р.', 4.8, 5, 'ИЯТШ') },
  { id: 4, title: 'Холодильник Бирюса компакт', description: 'Идеальный размер под стандартную тумбу в общаге.', price: 4500, offerType: 'sale', condition: 'excellent', category: 'Бытовая техника', dorm: DORMS[6], status: 'reserved', createdAt: ago(120), seller: s('Артем С.', 5, 14, 'ИШИТР') },
  { id: 5, title: 'Калькулятор Casio fx-991ES Plus', description: 'Непрограммируемый, разрешен на экзаменах ТПУ.', price: 1100, offerType: 'sale', condition: 'excellent', category: 'Электроника и ПК', dorm: DORMS[0], status: 'available', createdAt: ago(180), seller: s('Владислав Т.', 4.7, 11, 'ИШНКБ') },
  { id: 6, title: 'Сушилка для белья складная', description: 'Все прутья ровные, складывается за шкаф за 5 секунд.', price: 600, offerType: 'sale', condition: 'good', category: 'Мебель для комнат', dorm: DORMS[6], status: 'available', createdAt: ago(240), seller: s('Ольга М.', 4.9, 7, 'ИПР') },
  { id: 7, title: 'Wi-Fi роутер Keenetic City Dual', description: 'Настроен под сеть студгородка ТПУ.', price: 1400, offerType: 'sale', condition: 'excellent', category: 'Электроника и ПК', dorm: DORMS[4], status: 'available', createdAt: ago(300), seller: s('Илья Б.', 5, 23, 'ИШИТР') },
  { id: 8, title: 'Монитор Xiaomi A24i 100Hz IPS', description: 'Тонкие рамки, 100 Гц, отличная цветопередача.', price: 5800, offerType: 'sale', condition: 'new', category: 'Электроника и ПК', dorm: DORMS[0], status: 'bookable', createdAt: ago(360), seller: s('Сергей П.', 4.9, 16, 'ИШПР') },
  { id: 9, title: 'Гиря чугунная 16 кг (СССР)', description: 'Идеальная развесовка, удобная ручка.', price: 1300, offerType: 'sale', condition: 'good', category: 'Кухня и посуда', dorm: DORMS[0], status: 'available', createdAt: ago(420), seller: s('Кирилл Л.', 5, 12, 'ИШИТР') },
  { id: 101, title: 'Настольный вентилятор Polaris', description: 'Тихий, 3 скорости, шнур целый.', price: 500, offerType: 'sale', condition: 'good', category: 'Бытовая техника', dorm: DORMS[0], status: 'reserved', createdAt: ago(40), seller: s(CURRENT_USER.name, 4.85, 14, CURRENT_USER.institute) },
  { id: 102, title: 'Конспекты: Начертательная геометрия', description: '1 курс, 2 семестр, всё разборчиво.', price: 300, offerType: 'sale', condition: 'excellent', category: 'Учебники и методички', dorm: DORMS[0], status: 'moderation', createdAt: ago(15), seller: s(CURRENT_USER.name, 4.85, 14, CURRENT_USER.institute) },
  { id: 103, title: 'Электрочайник Tefal 1.7L', description: 'Проработал один семестр, без накипи.', price: 850, offerType: 'sale', condition: 'good', category: 'Бытовая техника', dorm: DORMS[0], status: 'sold', createdAt: ago(600), seller: s(CURRENT_USER.name, 4.85, 14, CURRENT_USER.institute) },
  { id: 104, title: 'LED‑лампа для чертежей с USB', description: 'Три режима яркости, отдаю за шоколадку.', price: 0, offerType: 'free', condition: 'good', category: 'Отдам даром (0 ₽)', dorm: DORMS[0], status: 'available', createdAt: ago(90), seller: s(CURRENT_USER.name, 4.85, 14, CURRENT_USER.institute) },
];

const agoM = (m: number) => Date.now() - m * 60_000;

export const INIT_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'message', title: 'Даниил К. ответил вам', body: 'Да, микроволновка свободна, спущусь к вахте после 18:30 🙂', createdAt: agoM(8), read: false, threadId: 't1', listingId: 1, link: '/chats' },
  { id: 'n2', type: 'booking', title: 'Продавец подтвердил бронь', body: 'Настольный вентилятор Polaris — встреча завтра 12:00, Общ. №16', createdAt: agoM(120), read: false, link: '/profile' },
  { id: 'n3', type: 'moderation', title: 'AI-проверка пройдена', body: 'Конспекты по начертательной геометрии отправлены студсовету на финальную проверку', createdAt: agoM(240), read: true, link: '/profile' },
  { id: 'n4', type: 'purchase', title: 'Сделка завершена', body: 'Задачник по ТОЭ получен. Оставьте отзыв соседу — это 5 секунд', createdAt: agoM(1500), read: true, link: '/profile' },
  { id: 'n5', type: 'system', title: 'Добро пожаловать в ТПУ Маркет', body: 'Верификация по аккаунту TPU.RU активна. Бронь без предоплаты доступна до 3 товаров', createdAt: agoM(4000), read: true },
];

export const INIT_THREADS: ChatThread[] = [
  {
    id: 't1', listingId: 1, listingTitle: 'Микроволновая печь LG Grill', listingPrice: 2200,
    sellerName: 'Даниил К.', sellerAvatar: 'Д', updatedAt: agoM(8), unread: 1,
    messages: [
      { id: 'm1', author: 'me', text: 'Здравствуйте! Печь ещё в наличии? Можно включить на вахте перед оплатой?', createdAt: agoM(40) },
      { id: 'm2', author: 'seller', text: 'Да, свободна. Включим в тестовую розетку на посту дежурного, как по регламенту ТПУ.', createdAt: agoM(30) },
      { id: 'm3', author: 'me', text: 'Отлично. Я бы забрал сегодня после 18:30, удобно?', createdAt: agoM(15) },
      { id: 'm4', author: 'seller', text: 'Да, микроволновка свободна, спущусь к вахте после 18:30 🙂', createdAt: agoM(8) },
    ],
  },
  {
    id: 't2', listingId: 3, listingTitle: 'Настольная лампа LED с USB', listingPrice: 0,
    sellerName: 'Максим Р.', sellerAvatar: 'М', updatedAt: agoM(300), unread: 0,
    messages: [
      { id: 'm5', author: 'me', text: 'Лампа ещё даром? Заберу за шоколадку 😄', createdAt: agoM(320) },
      { id: 'm6', author: 'seller', text: 'Конечно, подходи к 16-му, я на 3 этаже.', createdAt: agoM(300) },
    ],
  },
];