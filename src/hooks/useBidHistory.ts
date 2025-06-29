import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { productService } from '../services/productService';
import type { Bid } from '../interfaces/bidInterface';
import type { Product } from '../interfaces/productInterface';

// Enriched bid entry para la tabla
export interface EnrichedBid {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  amount: number;
  timestamp: string;
  status: 'Active' | 'Ended';
}

export const useBidHistory = (): EnrichedBid[] => {
  const { user } = useContext(UserContext)!;
  const [history, setHistory] = useState<EnrichedBid[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!user?.id) return;
      try {
        const bids: Bid[] = await productService.getBidsByUser(user.id);
        const enriched: EnrichedBid[] = await Promise.all(
          bids.map(async (bid) => {
            // Recupera datos del producto
            const product: Product = await productService.getProductById(bid.productId);
            const endTime = new Date(product.fechaInicio).getTime() + product.duracion * 1000;
            const status = Date.now() > endTime ? 'Ended' : 'Active';

            return {
              id: bid.id,
              productId: bid.productId,
              productTitle: product.titulo,
              productImage: product.imagen,
              amount: bid.amount,
              timestamp: new Date(bid.date).toLocaleString(),
              status,
            };
          })
        );
        setHistory(enriched);
      } catch (err) {
        console.error('Error loading bid history:', err);
      }
    };

    loadHistory();
  }, [user]);

  return history;
};