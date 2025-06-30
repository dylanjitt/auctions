import { useContext, useEffect, useState, useCallback } from "react";
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
import { useTranslation } from 'react-i18next';

interface BidEntry {
  user: string;
  amount: number;
  timestamp: string;
}



export default function AuctionRoom() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(UserContext)!;

  const [product, setProduct] = useState<Product | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bids, setBids] = useState<BidEntry[]>([]);
  const [winningBid, setWinningBid] = useState<BidEntry | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getBidValidationSchema = (currentPrice: number) =>
    Yup.object({
      bidAmount: Yup.number()
        .typeError(t('auctionRoom.placeBid.validation.number'))
        .required(t('auctionRoom.placeBid.validation.required'))
        .moreThan(
          currentPrice,
          t('auctionRoom.placeBid.validation.min', { price: currentPrice })
        ),
    });

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
    setSuccess(t('auctionRoom.newBid', { amount: incoming.amount }));
    console.log('success:', success)
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

  const formatAuctionStartDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!product) {
    return error
      ? <Alert severity="error">{t('auctionRoom.error')}</Alert>
      : <Typography>{t('auctionRoom.loading')}</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left: Image + bid history */}
        <Grid size={{ xs: 12, md: 6 }}>
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
                  <TableCell>{t('auctionRoom.bidHistory.user')}</TableCell>
                  <TableCell align="right">{t('auctionRoom.bidHistory.amount')}</TableCell>
                  <TableCell align="right">{t('auctionRoom.bidHistory.time')}</TableCell>
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>{product.titulo}</Typography>
              <Typography variant="body1" gutterBottom>{product.descripcion}</Typography>
              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {t('auctionRoom.status')}
                </Typography>

                {remaining <= 0 ? (
                  winningBid
                    ? <Card variant="outlined" sx={{ p: 2, background: '#f0f0f0' }}>
                      <Typography>
                        {t('auctionRoom.soldFor')} <strong>${winningBid.amount}</strong> {t('auction.to')} <strong>{winningBid.user}</strong>
                      </Typography>
                    </Card>
                    : <Typography>{t('auctionRoom.noBids')}</Typography>
                ) : new Date(product.fechaInicio) > new Date() ? (
                  <Typography>
                    {t('auctionRoom.comingSoon', {
                      date: formatAuctionStartDate(product.fechaInicio)
                    })}
                  </Typography>
                ) : (
                  <>
                    <Typography>
                      {t('auctionRoom.currentPrice')}: <strong>${currentPrice}</strong>
                    </Typography>
                    <Box sx={{ pt: 1 }}>
                      <Timer remainingSeconds={Math.ceil(remaining / 1000)} />
                    </Box>
                  </>
                )}
              </Paper>

              {remaining > 0 && user && new Date(product.fechaInicio) <= new Date() &&(
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    name="bidAmount"
                    label={t('auctionRoom.placeBid.label')}
                    type="number"
                    value={formik.values.bidAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bidAmount && Boolean(formik.errors.bidAmount)}
                    helperText={formik.touched.bidAmount && formik.errors.bidAmount}
                    sx={{ mb: 2 }}
                    inputProps={{ min: currentPrice + 1, step: 1 }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    {t('auctionRoom.placeBid.button')}
                  </Button>
                </Box>
              )}
              {!user && remaining > 0 && (
                <Alert severity="info">
                  {t('auctionRoom.placeBid.loginPrompt')}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
