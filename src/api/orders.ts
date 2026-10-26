export interface OrderRequest {
  listingIds: number[];
  meetings: Record<string, { point: string; interval: string }>; // keyed by seller name
  phone: string;
  comment: string;
}

// Replace with: fetch('/api/orders', { method: 'POST', headers: {...}, body: JSON.stringify(order) })
export async function createOrder(order: OrderRequest): Promise<{ id: number }> {
  await new Promise((r) => setTimeout(r, 400));
  if (!order.listingIds.length) throw new Error('empty order');
  return { id: Date.now() };
}
