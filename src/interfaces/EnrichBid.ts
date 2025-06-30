export interface EnrichedBid {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  amount: number;
  timestamp: string;
  status: 'Active' | 'Ended';
}