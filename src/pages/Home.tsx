import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { productService } from '../services/productService';
import { useAuctionStore } from '../store/useAuctionStore';
import { AuctionItem } from '../components/AuctionItem';
import { useNavigate } from 'react-router-dom';
import { useCountdown, useAuction } from '../hooks/useAuction';
import type { Bid } from '../interfaces/bidInterface';
import { useTranslation } from 'react-i18next';
interface PriceListenerProps {
  productId: string;
  onBid: (bid: Bid) => void;
  duration: number;
  startTime: string;
}

function PriceListener({ productId, onBid, duration, startTime }: PriceListenerProps) {
  const remaining = useCountdown(duration, startTime);
  useAuction(remaining > 0 ? productId : undefined, onBid);
  return null;
}

export default function Home() {

  const {t}=useTranslation()

  const setProducts = useAuctionStore(s => s.setProducts);
  const products = useAuctionStore(s => s.products);
  const updatePrice = useAuctionStore(s => s.updatePrice);
  const navigate = useNavigate();

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

  const now = Date.now();
  const current = products.filter(p => {
    const start = new Date(p.fechaInicio).getTime();
    const end = start + p.duracion * 1000;
    return start <= now && now <= end;
  });
  const upcoming = products.filter(p => new Date(p.fechaInicio).getTime() > now);
  const concluded = products.filter(p => {
    const start = new Date(p.fechaInicio).getTime();
    const end = start + p.duracion * 1000;
    return end < now;
  });

  const renderSection = (title: string, list: typeof products) => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>{title}</Typography>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {list.map(p => (
          <div key={p.id} onClick={() => goToAuctionRoom(p.id)} style={{cursor:'pointer'}}>
          <Grid size={{xs:12,sm:6,md:4,xl:3}} key={p.id}>
            <PriceListener
              productId={p.id}
              onBid={handleBidReceived}
              duration={p.duracion}
              startTime={p.fechaInicio}
            />
            <AuctionItem product={p}/>
            
          </Grid>
          </div>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ textAlign: 'center', width: '100%' }}>
      
      {renderSection(t('actualAuctions'), current)}
      {renderSection(t('nextAuctions'), upcoming)}
      {renderSection(t('overAuctions'), concluded)}
    </Box>
  );
}
