export const getEventStream = (productId: string): EventSource => {
  return new EventSource(`http://localhost:3003/api/products/${productId}/stream`);
};