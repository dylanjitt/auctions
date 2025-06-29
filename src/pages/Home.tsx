import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { productService } from '../services/productService';
import { useAuctionStore } from '../store/useAuctionStore';
import { AuctionItem } from '../components/AuctionItem';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
const Home = () => {
  const setProducts = useAuctionStore((state) => state.setProducts);
  const products = useAuctionStore((state) => state.products);

  const navigate = useNavigate()

  useEffect(() => {
    const getProducts = async () => {
      try {
        const items = await productService.getProducts();
        setProducts(items);
      } catch (error) {
        console.error(error);
      }
    };
    getProducts();
  }, [setProducts]);

  const goToAuctionRoom = (id: string) => {
    navigate(`auction/${id}`); 
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',width:'100%'}}>
      <h1>Subastas</h1>
      <Grid container spacing={2} sx={{ padding: 2, display:'flex',alignItems:'center',justifyContent:"center" }}>
      {products.map((product) => (
        <Grid size={{xs:12, sm:6, md:4}} key={product.id}>
          <AuctionItem product={product} >
          <AuctionItem.Actions>
            <Button 
              size="small" 
              onClick={()=>goToAuctionRoom(product.id)}
            >
              Place Bid
            </Button>
          </AuctionItem.Actions>
          
          </AuctionItem>
        </Grid>
      ))}
    </Grid>
    </div>
    
  );
};

export default Home;