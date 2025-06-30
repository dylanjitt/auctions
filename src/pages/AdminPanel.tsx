import { useEffect, useState, type FC } from 'react';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Product } from '../interfaces/productInterface';
import { productService } from '../services/productService';
import { AuctionItem } from '../components/AuctionItem';
import Grid from '@mui/material/Grid'
import BidForm from '../components/BidForm';
import { v4 as uuidv4 } from 'uuid';

const AdminPanel: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = (product?: Product) => {
    setSelected(product || null);
    console.log('Opening dialog for:', product ? 'edit' : 'create', product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Clear selected after dialog closes to ensure clean state
    setTimeout(() => setSelected(null), 100);
  };

  const handleSave = async (prod: Product) => {
    try {
      setIsLoading(true);
      console.log('Saving product:', prod);
      
      if (prod.id) {  // Simplified check - will work for empty string, null, or undefined
        // Update existing product
        console.log('Updating product with ID:', prod.id);
        await productService.updateProduct(prod.id, prod);
      } else {
        // Create new product
        console.log('Creating new product:', prod);
        await productService.createProduct({...prod,id:uuidv4()});
      }
      
      handleClose();
      await fetchProducts(); // Refresh the product list
      console.log('Product saved successfully');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelected(product);
    setOpen(true);
  };
  
  const handleDelete = async (productId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productService.deleteProduct(productId);
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
      <h1>Panel de Administrador</h1>
  
    <div>
      <IconButton 
        onClick={() => handleOpen()} 
        disabled={isLoading}
        title="Add New Product"
        sx={{width:50,height:50}}
      >
        <AddIcon sx={{width:30,height:30}} />
      </IconButton>
      
      <Grid container spacing={2}>
        {products.map(p => (
          <Grid key={p.id} size={{xs:12, sm:6, md:4}} >
            <div 
              //onClick={() => handleOpen(p)}
              //style={{ cursor: 'pointer' }}
            >
              <AuctionItem product={p}>
                <AuctionItem.Actions>
                <Button 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(p);
              }}
            >
              Editar
            </Button>
            <Button 
              size="small" 
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(p.id);
              }}
            >
              Eliminar
            </Button>
                </AuctionItem.Actions>
              </AuctionItem>
            </div>
          </Grid>
        ))}
      </Grid>
      
      <BidForm
        open={open}
        product={selected}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
    </div>
  );
};

export default AdminPanel;