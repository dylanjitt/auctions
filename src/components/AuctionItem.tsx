import type { FC } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCountdown } from '../hooks/useAuction';
import Timer from './Timer';
import type { Product } from '../interfaces/productInterface';

interface AuctionItemProps {
  product: Product;
}

export const AuctionItem: FC<AuctionItemProps> & {
  Image: FC<{ src: string; title: string }>;
  Content: FC<Pick<Product, 'titulo' | 'descripcion' | 'precioBase'>>;
  TimerSection: FC<Pick<Product, 'duracion' | 'fechaInicio'>>;
  Actions: FC;
} = ({ product }) => (
  <Card sx={{ width: 370, height:550 }}>
    <AuctionItem.Image src={product.imagen} title={product.titulo} />
    <AuctionItem.Content
      titulo={product.titulo}
      descripcion={product.descripcion}
      precioBase={product.precioBase}
    />
    <AuctionItem.TimerSection
      duracion={product.duracion}
      fechaInicio={product.fechaInicio}
    />
    <AuctionItem.Actions />
  </Card>
);

AuctionItem.Image = ({ src, title }) => (
  <CardMedia sx={{ height: 280 }} image={src} title={title} />
);

AuctionItem.Content = ({ titulo, descripcion, precioBase }) => (
  <CardContent>
    <Typography gutterBottom variant="h5" component="div">
      {titulo}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {descripcion}
    </Typography>
    <Typography variant="body1" color="text.primary">
      Precio base: ${precioBase}
    </Typography>
  </CardContent>
);

// TimerSection uses useCountdown for both upcoming and active auctions
// AuctionItem.TimerSection = ({ duracion, fechaInicio }) => {
//   const now = Date.now();
//   const startMs = new Date(fechaInicio).getTime();
//   const endMs = startMs + duracion * 1000;

//   if (now < startMs) {
//     // Upcoming: countdown to start
//     const secondsToStart = Math.ceil((startMs - now) / 1000);
//     const startCountdown = useCountdown(secondsToStart, new Date().toISOString());
//     const remainingStartSec = Math.ceil(startCountdown / 1000);

//     return (
//       <CardContent>
//         <Typography variant="body2" color="text.primary">
//           Subasta comienza en:
//         </Typography>
//         <Timer remainingSeconds={remainingStartSec} />
//       </CardContent>
//     );
//   }

//   if (now >= startMs && now <= endMs) {
//     // Active: countdown to end
//     const activeCountdown = useCountdown(duracion, fechaInicio);
//     const remainingEndSec = Math.ceil(activeCountdown / 1000);

//     return (
//       <CardContent>
//         <Typography variant="body2" color="text.secondary">
//           Tiempo restante:
//         </Typography>
//         <Timer remainingSeconds={remainingEndSec} />
//       </CardContent>
//     );
//   }

//   // Closed
//   return (
//     <CardContent>
//       <Typography variant="body2" color="error">
//         Subasta cerrada
//       </Typography>
//     </CardContent>
//   );
// };
AuctionItem.TimerSection = ({ duracion, fechaInicio }) => {
  const now = Date.now();
  const startMs = new Date(fechaInicio).getTime();
  const endMs = startMs + duracion * 1000;

  if (now < startMs) {
    // Upcoming: display exact start date/time
    const startDate = new Date(fechaInicio);
    const formatted = startDate.toLocaleString();
    return (
      <CardContent>
        <Typography variant="body2" color="text.primary">
          Subasta comienza el: {formatted}
        </Typography>
      </CardContent>
    );
  }

  if (now >= startMs && now <= endMs) {
    // Active: countdown to end
    const remainingMs = useCountdown(duracion, fechaInicio);
    const remainingSec = Math.ceil(remainingMs / 1000);
    return (
      <CardContent>
        <Timer remainingSeconds={remainingSec} />
      </CardContent>
    );
  }

  // Closed
  return (
    <CardContent>
      <Typography variant="body2" color="error">
        Subasta cerrada
      </Typography>
    </CardContent>
  );
};

AuctionItem.Actions = () => (
  <CardActions>
    <Button size="small">Ver</Button>
  </CardActions>
);