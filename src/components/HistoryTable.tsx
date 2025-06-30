import { useTranslation } from 'react-i18next';
import type { EnrichedBid } from '../interfaces/EnrichBid';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
} from '@mui/material';

interface Props {
  history: EnrichedBid[];
}

export function HistoryTable({ history }: Props) {
  const { t } = useTranslation();
  // Determine highest bid per product when ended
  const winnersMap: Record<string, number> = {};
  history.forEach(entry => {
    if (entry.status === t('history.status.ended')) {
      const currentMax = winnersMap[entry.productTitle] || 0;
      winnersMap[entry.productTitle] = Math.max(currentMax, entry.amount);
    }
  });

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
      <TableHead>
          <TableRow>
            <TableCell>{t('history.table.header.image')}</TableCell>
            <TableCell>{t('history.table.header.product')}</TableCell>
            <TableCell align="right">{t('history.table.header.amount')}</TableCell>
            <TableCell align="center">{t('history.table.header.status')}</TableCell>
            <TableCell align="right">{t('history.table.header.timestamp')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map(entry => {
            const isWinner =
              entry.status === t('history.status.ended') &&
              entry.amount === winnersMap[entry.productTitle];

            return (
              <TableRow key={entry.id}>
                <TableCell>
                  <Avatar
                    variant="square"
                    src={entry.productImage}
                    alt={entry.productTitle}
                    sx={{ width: 200, height: 200 }}
                  />
                </TableCell>
                <TableCell>{entry.productTitle}</TableCell>
                <TableCell align="right">${entry.amount}</TableCell>
                <TableCell align="center">
                  <Box sx={{ fontWeight: isWinner ? 'bold' : 'normal', color: isWinner?'green':'black' }}>
                    {entry.status}
                    {isWinner && ` (${t('history.status.winner')})`}
                  </Box>
                </TableCell>
                <TableCell align="right">{entry.timestamp}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}