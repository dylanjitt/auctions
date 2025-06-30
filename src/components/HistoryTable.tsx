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
  // Determine highest bid per product when ended
  const winnersMap: Record<string, number> = {};
  history.forEach(entry => {
    if (entry.status === 'Ended') {
      const currentMax = winnersMap[entry.productTitle] || 0;
      winnersMap[entry.productTitle] = Math.max(currentMax, entry.amount);
    }
  });

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Imagen</TableCell>
            <TableCell>Artículo</TableCell>
            <TableCell align="right">Monto ofertado</TableCell>
            <TableCell align="center">Estado de subasta</TableCell>
            <TableCell align="right">Fecha y Hora</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map(entry => {
            const isWinner =
              entry.status === 'Ended' &&
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
                    {isWinner && ' (winner)'}
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