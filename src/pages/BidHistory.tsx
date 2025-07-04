import { useMemo, useState } from 'react';
import { useBidHistory} from '../hooks/useBidHistory';
import { HistoryTable } from '../components/HistoryTable';
import type { EnrichedBid } from '../interfaces/EnrichBid';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function BidHistory() {

  const { t } = useTranslation();

  const history = useBidHistory();

  // Estados de filtros
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('All');

  // Opciones únicas
  const productOptions = useMemo(() => {
    const set = new Set<string>(history.map(h => h.productTitle));
    return ['All', ...Array.from(set)];
  }, [history]);

  const statusOptions = useMemo(() => ['All', 'Active', 'Ended'], []);

  const dateOptions = useMemo(() => {
    const set = new Set<string>(history.map(h => h.timestamp.split(',')[0]));
    return ['All', ...Array.from(set)];
  }, [history]);

  // Historial filtrado
  const filtered = useMemo<EnrichedBid[]>(() => {
    return history.filter(h => {
      const matchProduct = selectedProduct === 'All' || h.productTitle === selectedProduct;
      const matchStatus = selectedStatus === 'All' || h.status === selectedStatus;
      const datePart = h.timestamp.split(',')[0];
      const matchDate = selectedDate === 'All' || datePart === selectedDate;
      return matchProduct && matchStatus && matchDate;
    });
  }, [history, selectedProduct, selectedStatus, selectedDate]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('bidHistorialLocal')}
      </Typography>
      {history.length === 0 ? (
        <Typography>{t('noLocalBidsYet')}</Typography>
      ) : (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, width:'500px' }}>
            <FormControl size="small">
              <InputLabel>{t('product')}</InputLabel>
              <Select
                label="Producto"
                value={selectedProduct}
                sx={{width:150}}
                onChange={e => setSelectedProduct(e.target.value)}
              >
                {productOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>{t('state')}</InputLabel>
              <Select
                label="Estado"
                value={selectedStatus}
                sx={{width:150}}
                onChange={e => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>{t('date')}</InputLabel>
              <Select
                label="Fecha"
                value={selectedDate}
                sx={{width:150}}
                onChange={e => setSelectedDate(e.target.value)}
              >
                {dateOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <HistoryTable history={filtered} />
        </>
      )}
    </Box>
  );
}
