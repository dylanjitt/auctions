// src/components/AdminPanel.tsx
import { useEffect, useState, type FC } from 'react';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Product } from '../interfaces/productInterface';
import { productService } from '../services/productService';
import { AuctionItem } from '../components/AuctionItem';
import Grid from '@mui/material/Grid';
import BidForm from '../components/BidForm';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

const AdminPanel: FC = () => {
  const { t } = useTranslation();
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
      console.error(t('admin.errorFetching'), error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = (product?: Product) => {
    setSelected(product || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelected(null), 100);
  };

  const handleSave = async (prod: Product) => {
    try {
      setIsLoading(true);
      if (prod.id) {
        await productService.updateProduct(prod.id, prod);
      } else {
        await productService.createProduct({ ...prod, id: uuidv4() });
      }
      handleClose();
      await fetchProducts();
    } catch (error) {
      console.error(t('admin.errorSaving'), error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelected(product);
    setOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        await productService.deleteProduct(productId);
        await fetchProducts();
      } catch (error) {
        console.error(t('admin.errorDeleting'), error);
      }
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1>{t('admin.title')}</h1>

      <div>
        <IconButton
          onClick={() => handleOpen()}
          disabled={isLoading}
          title={t('admin.addNew')}
          sx={{ width: 50, height: 50 }}
        >
          <AddIcon sx={{ width: 30, height: 30 }} />
        </IconButton>

        <Grid container spacing={2}>
          {products.map(p => (
            <Grid key={p.id} size={{xs:12, sm:6, md:4}} >
              <AuctionItem product={p}>
                <AuctionItem.Actions>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(p);
                    }}
                  >
                    {t('admin.edit')}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.id);
                    }}
                  >
                    {t('admin.delete')}
                  </Button>
                </AuctionItem.Actions>
              </AuctionItem>
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
