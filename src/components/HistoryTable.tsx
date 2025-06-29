import type { EnrichedBid } from '../hooks/useBidHistory';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';

interface Props {
  history: EnrichedBid[];
}

export function HistoryTable({ history }: Props) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Imagen</TableCell>
            <TableCell>Artículo</TableCell>
            <TableCell align="right">Monto ofertado</TableCell>
            <TableCell align="center">Estado de Subasta</TableCell>
            <TableCell align="right">Fecha y Hora</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <Avatar
                  variant="square"
                  src={entry.productImage}
                  alt={entry.productTitle}
                  sx={{ width: 150, height: 150 }}
                />
              </TableCell>
              <TableCell>{entry.productTitle}</TableCell>
              <TableCell align="right">${entry.amount}</TableCell>
              <TableCell align="center">{entry.status}</TableCell>
              <TableCell align="right">{entry.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}