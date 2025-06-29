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

// export const useAuction = (productId?: string, onBidReceived?: (bid: Bid) => void) => {
//   const [auctionStatus, setAuctionStatus] = useState<string>('active');
//   const sseRef = useRef<EventSource | null>(null);

//   useEffect(() => {
//     if (!productId) return;

//     const setupSSE = () => {
//       const sseUrl = `http://localhost:3003/api/products/${productId}/stream`;
//       console.log('Connecting to SSE:', sseUrl);
      
//       sseRef.current = new EventSource(sseUrl);

//       sseRef.current.onopen = () => {
//         console.log('SSE connection established');
//       };
//       sseRef.current.onmessage = (event) => {
//         try{
//           console.log('[SSE] Generic message received:', event.data);
        
//         }catch (error) {
//           console.error('Error handling SSE message:', error);
//         }
        
        
//       };
//       sseRef.current.addEventListener('CONNECTED', (event) => {
//         console.log('[SSE] Connection confirmed:', event.data);
//       });

//       // Only listen for specific event type
//       sseRef.current.addEventListener('NEW_BID', (event) => {
//         const data = JSON.parse(event.data);
//         onBidReceived?.(data.payload);
//       });

//       sseRef.current.onerror = (err) => {
//         console.error('[SSE] Error:', err);
//         sseRef.current?.close();
        
//         // Attempt reconnection after delay
//         setTimeout(() => {
//           console.log('Attempting SSE reconnection...');
//           setupSSE();
//         }, 1000);
//       };
//     };

//     setupSSE();

//     return () => {
//       console.log('Cleaning up SSE connection');
//       sseRef.current?.close();
//       sseRef.current = null;
//     };
//   }, [productId, onBidReceived]);
  
//   const placeBid = async (productId: string, userId: string, amount: number) => {
//     const bid: Bid = {
//       id: crypto.randomUUID(),
//       productId,
//       userId,
//       amount,
//       date: new Date().toISOString()
//     };

//     await productService.createBid(bid);
//     await productService.updateProduct(productId, { precioBase: amount }); // ensure correct product update
//   };

//   return { placeBid, auctionStatus,useCountdown };

//   };


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