// src/components/AuctionRoom.tsx
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/productService";
import type { Product } from "../interfaces/productInterface";
import { UserContext } from '../context/UserContext';
import { useAuction } from '../hooks/useAuction';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material';
import Timer from '../components/Timer';
import { useCountdown } from '../hooks/useAuction';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Bid } from "../interfaces/bidInterface";
import { userService } from "../services/userService";

interface BidEntry {
  user: string;
  amount: number;
  timestamp: string;
}

const getBidValidationSchema = (currentPrice: number) =>
  Yup.object({
    bidAmount: Yup.number()
      .typeError('Please enter a valid number')
      .required('Bid is required')
      .moreThan(currentPrice, `Bid must be higher than current price ($${currentPrice})`),
  });

export default function AuctionRoom() {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(UserContext)!;

  const [product, setProduct] = useState<Product | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bids, setBids] = useState<BidEntry[]>([]);
  const [winningBid, setWinningBid] = useState<BidEntry | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load product and initial bids
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const p = await productService.getProductById(id);
        setProduct(p);
        setCurrentPrice(p.precioBase);

        const rawBids = await productService.getBids(id);
        const enriched = await Promise.all(
          rawBids.map(async (b: Bid) => {
            const usr = await userService.getUserById(b.userId).catch(() => ({ username: 'Unknown' }));
            return {
              user: usr.username,
              amount: b.amount,
              timestamp: new Date(b.date).toLocaleTimeString(),
            };
          })
        );
        setBids(enriched.reverse());
      } catch (e) {
        console.error(e);
        setError('Failed to load auction data');
      }
    })();
  }, [id]);

  // Countdown
  const remaining = useCountdown(product?.duracion || 0, product?.fechaInicio || '');

  // SSE subscription: only while auction active
  const handleBidReceived = useCallback(async (incoming: Bid) => {
    if (incoming.amount <= currentPrice) return;

    // fetch username
    const usr = await userService.getUserById(incoming.userId).catch(() => ({ username: 'Anonymous' }));
    const entry: BidEntry = {
      user: usr.username,
      amount: incoming.amount,
      timestamp: new Date(incoming.date).toLocaleTimeString(),
    };

    // update state
    setCurrentPrice(incoming.amount);
    setBids(prev => [entry, ...prev]);
    setSuccess(`New bid received: $${incoming.amount}`);
    setTimeout(() => setSuccess(''), 3000);
  }, [currentPrice]);

  useAuction(remaining > 0 ? id : undefined, handleBidReceived);

  // Determine winning bid once ended
  useEffect(() => {
    if (remaining <= 0 && bids.length) {
      setWinningBid(bids[0]);
    }
  }, [remaining, bids]);

  // Formik
  const formik = useFormik({
    initialValues: { bidAmount: '' },
    validationSchema: getBidValidationSchema(currentPrice),
    enableReinitialize: true,
    onSubmit: async (vals, { resetForm }) => {
      if (!id || !user) return;
      try {
        const amt = parseFloat(vals.bidAmount);
        await productService.createBid({ id: '', productId: id, userId: user.id, amount: amt, date: new Date().toISOString() });
        // price update and UI will come from SSE
        resetForm();
      } catch (e) {
        console.error(e);
        setError('Failed to place bid');
      }
    }
  });

  if (!product) {
    return error
      ? <Alert severity="error">{error}</Alert>
      : <Typography>Loading auction...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left: Image + bid history */}
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
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids.map((b, i) => (
                  <TableRow key={i}>
                    <TableCell>{b.user}</TableCell>
                    <TableCell align="right">${b.amount}</TableCell>
                    <TableCell align="right">{b.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Right: Details + form or result */}
        <Grid size={{xs:12,md:6}}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>{product.titulo}</Typography>
              <Typography variant="body1" gutterBottom>{product.descripcion}</Typography>
              <Paper elevation={2} sx={{ p:2, mb:3 }}>
                <Typography variant="h6" gutterBottom>Auction Status</Typography>

                {remaining <= 0 ? (
                  winningBid 
                    ? <Card variant="outlined" sx={{ p:2, background:'#f0f0f0' }}>
                        <Typography>
                          Sold for <strong>${winningBid.amount}</strong> to <strong>{winningBid.user}</strong>
                        </Typography>
                      </Card>
                    : <Typography>No bids were placed.</Typography>
                ) : (
                  <>
                    <Typography>Current Price: <strong>${currentPrice}</strong></Typography>
                    <Box sx={{ pt:1 }}>
                      <Timer remainingSeconds={Math.ceil(remaining/1000)} />
                    </Box>
                  </>
                )}
              </Paper>

              {remaining > 0 && user && (
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt:3 }}>
                  <TextField
                    fullWidth
                    name="bidAmount"
                    label="Your Bid Amount"
                    type="number"
                    value={formik.values.bidAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bidAmount && Boolean(formik.errors.bidAmount)}
                    helperText={formik.touched.bidAmount && formik.errors.bidAmount}
                    sx={{ mb:2 }}
                    inputProps={{ min: currentPrice + 1, step: 1 }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Place Bid
                  </Button>
                </Box>
              )}
              {!user && remaining > 0 && (
                <Alert severity="info">Please log in to place a bid</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
