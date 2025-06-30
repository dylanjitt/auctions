import { useEffect, useRef, useState } from 'react';
import { productService } from '../services/productService';
// import { getEventStream } from '../services/sseService';
import type { Bid } from '../interfaces/bidInterface';

export const useCountdown = (duration: number, startTime: string) => {
  const [remaining, setRemaining] = useState(0);

  // Alternative implementation
useEffect(() => {
  const endTimestamp = new Date(startTime).getTime() + duration * 1000;
  
  const update = () => {
    const diff = endTimestamp - Date.now();
    setRemaining(Math.max(0, diff));
    
    if (diff > 0) {
      const timeout = setTimeout(update, 1000); // Update every second instead of every frame
      return () => clearTimeout(timeout);
    }
  };

  update();
}, [duration, startTime]);

  return remaining;
};

export const useAuction = (
  productId: string | undefined,
  onBidReceived: (bid: Bid) => void
) => {
  const sseRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!productId) return;
    const setup = () => {
      const url = `http://localhost:3003/api/products/${productId}/stream`;
      const es = new EventSource(url);
      sseRef.current = es;

      es.addEventListener('NEW_BID', async e => {
        // { payload: { id: number, ... } }
        const { payload } = JSON.parse(e.data);
        // convertir id a string
        const bid: Bid = { ...payload, id: payload.id.toString() };
        // 1) notify UI
        onBidReceived(bid);
        // 2) persistir nuevo precio en backend
        try {
          await productService.updateProduct(productId, { precioBase: bid.amount });
        } catch (err) {
          console.error('Failed to persist new price', err);
        }
      });

      es.onerror = () => {
        es.close();
        setTimeout(setup, 2000);
      };
    };
    setup();
    return () => {
      sseRef.current?.close();
      sseRef.current = null;
    };
  }, [productId, onBidReceived]);
};