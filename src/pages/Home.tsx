// import { useEffect } from 'react';
// import Grid from '@mui/material/Grid';
// import { productService } from '../services/productService';
// import { useAuctionStore } from '../store/useAuctionStore';
// import { AuctionItem } from '../components/AuctionItem';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@mui/material';
// const Home = () => {
//   const setProducts = useAuctionStore((state) => state.setProducts);
//   const products = useAuctionStore((state) => state.products);

//   const navigate = useNavigate()

//   useEffect(() => {
//     const getProducts = async () => {
//       try {
//         const items = await productService.getProducts();
//         setProducts(items);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     getProducts();
//   }, [setProducts]);

//   const goToAuctionRoom = (id: string) => {
//     navigate(`auction/${id}`); 
//   }

//   return (
//     <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',width:'100%'}}>
//       <h1>Subastas</h1>
//       <Grid container spacing={2} sx={{ padding: 2, display:'flex',alignItems:'center',justifyContent:"center" }}>
//       {products.map((product) => (
//         <Grid size={{xs:12, sm:6, md:4,xl:3}} key={product.id}>
//           <AuctionItem product={product} >
//           <AuctionItem.Actions>
//             <Button 
//               size="small" 
//               onClick={()=>goToAuctionRoom(product.id)}
//             >
//               Place Bid
//             </Button>
//           </AuctionItem.Actions>
          
//           </AuctionItem>
//         </Grid>
//       ))}
//     </Grid>
//     </div>
    
//   );
// };

// export default Home;

// src/pages/Home.tsx
import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { productService } from '../services/productService';
import { useAuctionStore } from '../store/useAuctionStore';
import { AuctionItem } from '../components/AuctionItem';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useCountdown, useAuction } from '../hooks/useAuction';
import type { Bid } from '../interfaces/bidInterface';

interface PriceListenerProps {
  productId: string;
  onBid: (bid: Bid) => void;
  duration: number;
  startTime: string;
}

function PriceListener({ productId, onBid, duration, startTime }: PriceListenerProps) {
  const remaining = useCountdown(duration, startTime);
  useAuction(remaining > 0 ? productId : undefined, onBid);
  return null; // Este componente no renderiza nada visible
}

export default function Home() {
  const setProducts = useAuctionStore(s => s.setProducts);
  const products = useAuctionStore(s => s.products);
  const updatePrice = useAuctionStore(s => s.updatePrice);
  const navigate = useNavigate();

  // Carga inicial de productos
  useEffect(() => {
    (async () => {
      try {
        const items = await productService.getProducts();
        setProducts(items);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    })();
  }, [setProducts]);

  const handleBidReceived = (bid: Bid) => {
    updatePrice(bid.productId, bid.amount);
  };

  const goToAuctionRoom = (id: string) => navigate(`auction/${id}`);

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h1>Subastas</h1>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {products.map(p => (
          <Grid size={{xs:12, sm:6, md:4,xl:3}} key={p.id}>
            {/* Listener que actualiza precio en tiempo real */}
            <PriceListener
              productId={p.id}
              onBid={handleBidReceived}
              duration={p.duracion}
              startTime={p.fechaInicio}
            />

            <AuctionItem product={p}>
              <AuctionItem.Actions>
                <Button size="small" onClick={() => goToAuctionRoom(p.id)}>
                  Place Bid
                </Button>
              </AuctionItem.Actions>
            </AuctionItem>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
