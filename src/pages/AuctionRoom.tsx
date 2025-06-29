import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/productService";
import type { Product } from "../interfaces/productInterface";
import { UserContext } from '../context/UserContext';
import { useAuction } from '../hooks/useAuction';
import { Box, Typography, TextField, Button, Card, CardContent, CardMedia, Paper, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import Timer from '../components/Timer';
import { useCountdown } from "../hooks/useAuction";
import { useFormik } from 'formik';
import * as Yup from 'yup';

// --- Validation Schema Factory ---
const getBidValidationSchema = (currentPrice: number) =>
  Yup.object({
    bidAmount: Yup.number()
      .typeError('Please enter a valid number')
      .required('Bid is required')
      .moreThan(currentPrice, `Bid must be higher than current price ($${currentPrice})`),
  });

// --- Main Auction Room Component ---
function AuctionRoom() {
  const { id } = useParams();
  const { user } = useContext(UserContext)!;
  const [product, setProduct] = useState<null | Product>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { placeBid } = useAuction(product?.id, (incomingBid) => {
    if (incomingBid.amount > currentPrice) {
      setCurrentPrice(incomingBid.amount);
      setSuccess(`New bid received: $${incomingBid.amount}`);
      setTimeout(() => setSuccess(''), 3000);
    }
  });
  const remainingTime = useCountdown(product?.duracion || 0, product?.fechaInicio || '');

  const fetchProduct = useCallback(async (id: string) => {
    try {
      const response = await productService.getProductById(id);
      setProduct(response);
      setCurrentPrice(response.precioBase);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load auction');
    }
  }, []);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id, fetchProduct]);

  // useEffect(() => {
  //   if (product) {
  //     // re-suscribe to new SSE if product changes
  //     const cleanup = useAuction(product.id, handleIncomingBid);
  //     return cleanup;
  //   }
  // }, [product]);

  const auctionEnded = remainingTime <= 0;
  const auctionActive = !auctionEnded && product && new Date(product.fechaInicio) <= new Date();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { bidAmount: '' },
    validationSchema: getBidValidationSchema(currentPrice),
    onSubmit: async (values, { resetForm }) => {
      if (!product || !user) return;
      try {
        const bidValue = parseFloat(values.bidAmount);
        await placeBid(product.id, user.id, bidValue);
        setCurrentPrice(bidValue);
        setSuccess('Bid placed successfully!');
        setError('');
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to place bid');
        setSuccess('');
      }
    }
  });

  return (
    <Box sx={{ p: 4 }}>
      {product ? (
        <Grid container spacing={4}>
          {/* Left Side - Product Image */}
          <Grid size={{xs:12,md:6}}>
            <Card>
              <CardMedia
                component="img"
                height="500"
                image={product.imagen}
                alt={product.titulo}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
          </Grid>

          {/* Right Side - Product Info and Bidding */}
          <Grid size={{xs:12,md:6}}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {product.titulo}
                </Typography>
                <Typography variant="body1" >
                  {product.descripcion}
                </Typography>

                {/* Auction Status */}
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Auction Status
                  </Typography>
                  {auctionActive ? (
                    <>
                      <Typography variant="body1">
                        Current Price: <strong>${currentPrice}</strong>
                      </Typography>
                      <Box sx={{ pt: 1 }}>
                        <Timer remainingSeconds={Math.ceil(remainingTime / 1000)} />
                      </Box>
                    </>
                  ) : auctionEnded ? (
                    <Typography color="error" variant="body1">
                      Auction has ended
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body1">
                        Initial Price: <strong>${currentPrice}</strong>
                      </Typography>
                      <Typography variant="body1">
                        Auction starts at: {new Date(product.fechaInicio).toLocaleString()}
                      </Typography>
                    </>
                  )}
                </Paper>

                {/* Bidding Form */}
                {auctionActive && user && (
                  <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <TextField
                      fullWidth
                      id="bidAmount"
                      name="bidAmount"
                      label="Your Bid Amount"
                      type="number"
                      value={formik.values.bidAmount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      inputProps={{ min: currentPrice + 1, step: 1 }}
                      error={formik.touched.bidAmount && Boolean(formik.errors.bidAmount)}
                      helperText={formik.touched.bidAmount && formik.errors.bidAmount}
                      sx={{ mb: 2 }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={!formik.values.bidAmount || formik.isSubmitting}
                    >
                      Place Bid
                    </Button>
                  </Box>
                )}

                {!user && (
                  <Alert severity="info">
                    Please log in to place a bid
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Typography>Loading auction...</Typography>
      )}
    </Box>
  );
}

export default AuctionRoom;
