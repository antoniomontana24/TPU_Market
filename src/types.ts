export type OfferType = 'sale' | 'rent' | 'free';
export type Condition = 'new' | 'excellent' | 'good' | 'parts';
export type Status = 'available' | 'reserved' | 'bookable'| 'moderation' | 'sold' | 'draft'; 
export type SortKey = 'new' | 'cheap' | 'expensive';

export interface Seller {
  name: string;
  rating: number;
  reviews: number;
  institute: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  offerType: OfferType;
  condition: Condition;
  category: string;
  dorm: string;
  status: Status;
  createdAt: number;
  image?: string;
  seller: Seller;
}

export interface Filters {
  search: string;
  dorms: string[];
  categories: string[];
  priceMin: number;
  priceMax: number;
  offerTypes: OfferType[];
  conditions: Condition[];
  onlyAvailable: boolean;
  sort: SortKey;
  page: number;
}

export const DEFAULT_FILTERS: Filters = {
  search: '', dorms: [], categories: [], priceMin: 0, priceMax: 15000,
  offerTypes: [], conditions: [], onlyAvailable: false, sort: 'new', page: 1,
};


export interface NewListingInput {
  title: string;
  description: string;
  price: number;
  offerType: OfferType;
  condition: Condition;
  category: string;
  dorm: string;
  image?: string;
  status: Status;
}

export type NotificationType = 'message' | 'booking' | 'purchase' | 'moderation' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  link?: string;       
  threadId?: string;
  listingId?: number;
}

export interface ChatMessage { id: string; author: 'me' | 'seller'; text: string; createdAt: number }

export interface ChatThread {
  id: string;
  listingId: number;
  listingTitle: string;
  listingPrice: number;
  listingImage?: string;
  sellerName: string;
  sellerAvatar: string;
  messages: ChatMessage[];
  updatedAt: number;
  unread: number;
}

export interface Booking {
  id: string; listingId: number; sku: string; title: string; price: number;
  dorm: string; seller: string; interval: string; expiresAt: number; createdAt: number;
}
export interface CompletedDeal {
  id: string; when: string; title: string; counterparty: string;
  price: number; kind: 'buy' | 'sell' | 'gift'; review?: number;
}
export interface CancelledBooking { id: string; when: string; title: string; reason: string }

