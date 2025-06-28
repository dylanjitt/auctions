import type { FC, ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCountdown } from '../hooks/useAuction';
import Timer from './Timer';
import type { Product } from '../interfaces/productInterface';
import React from 'react';

interface AuctionItemProps {
  product: Product;
  children?: ReactNode; // Add children prop
}

interface ActionsProps {
  children?: ReactNode;
}

export const AuctionItem: FC<AuctionItemProps> & {
  Image: FC<{ src: string; title: string }>;
  Content: FC<Pick<Product, 'titulo' | 'descripcion' | 'precioBase'>>;
  TimerSection: FC<Pick<Product, 'duracion' | 'fechaInicio'>>;
  Actions: FC;
} = React.memo(({ product,children }:AuctionItemProps) => (
  <Card sx={{ width: 370, height:570 }}>
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
    {children || <AuctionItem.Actions />}
  </Card>
));

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

AuctionItem.TimerSection = ({ duracion, fechaInicio }) => {
  const now = Date.now();
  const startMs = new Date(fechaInicio).getTime();
  const endMs = startMs + duracion * 1000;

  // Only call useCountdown when actually needed
  const remainingMs = now >= startMs && now <= endMs 
    ? useCountdown(duracion, fechaInicio)
    : 0;

  if (now < startMs) {
    const formatted = new Date(fechaInicio).toLocaleString();
    return (
      <CardContent>
        <Typography>Subasta comienza el: {formatted}</Typography>
      </CardContent>
    );
  }

  if (now <= endMs) {
    return (
      <CardContent>
        <Timer remainingSeconds={Math.ceil(remainingMs / 1000)} />
      </CardContent>
    );
  }

  return (
    <CardContent>
      <Typography color="error">Subasta cerrada</Typography>
    </CardContent>
  );
};

// Updated Actions component to accept children
AuctionItem.Actions = ({ children }: ActionsProps) => (
  <CardActions>
    {children || <Button size="small">Ver</Button>}
  </CardActions>
);