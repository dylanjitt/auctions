import { useEffect, useRef, useState, useCallback } from 'react';
import { productService } from '../services/productService';
import { getEventStream } from '../services/sseService';
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

export const useAuction = (productId?: string, onBidReceived?: (bid: Bid) => void) => {
  const [auctionStatus, setAuctionStatus] = useState<string>('active');

  useEffect(() => {
    if (!productId) return;

    const eventSource = getEventStream(productId);

    eventSource.onmessage = (event) => {
      const bid: Bid = JSON.parse(event.data);
      onBidReceived?.(bid);
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [productId, onBidReceived]);
  
  const placeBid = async (productId: string, userId: string, amount: number) => {
    const bid: Bid = {
      id: crypto.randomUUID(),
      productId,
      userId,
      amount,
      date: new Date().toISOString()
    };

    await productService.createBid(bid);
    await productService.updateProduct(productId, { precioBase: amount }); // ensure correct product update
  };

  return { placeBid, auctionStatus,useCountdown };

  };

  


// export const useAuction = () => {
//   return { useCountdown };
// };