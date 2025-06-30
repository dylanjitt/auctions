// src/components/AuctionItem.tsx
import type { FC, ReactNode } from 'react';
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useCountdown } from '../hooks/useAuction';
import Timer from './Timer';
import type { Product } from '../interfaces/productInterface';

interface AuctionItemProps {
  product: Product;
  children?: ReactNode;
}
interface ActionsProps {
  children?: ReactNode;
}

export const AuctionItem: FC<AuctionItemProps> & {
  Image: FC<{ src: string; title: string }>;
  Content: FC<Pick<Product, 'titulo' | 'descripcion' | 'precioBase'>>;
  TimerSection: FC<Pick<Product, 'duracion' | 'fechaInicio'>>;
  Actions: FC<ActionsProps>;
} = React.memo(({ product, children }:AuctionItemProps) => (
  <Card sx={{ width: 380 }}>
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
    {children || <AuctionItem.Actions>{null}</AuctionItem.Actions>}
  </Card>
));

AuctionItem.Image = ({ src, title }) => (
  <CardMedia sx={{ height: 280 }} image={src} title={title} />
);

AuctionItem.Content = ({ titulo, descripcion, precioBase }) => {
  const { t } = useTranslation();
  return (
    <CardContent sx={{ height: 85 }}>
      <Typography gutterBottom variant="h5">
        {t('auction.title', { title: titulo })}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('auction.description', { description: descripcion })}
      </Typography>
      <Typography variant="body1" color="text.primary">
        {t('auction.basePrice')}: ${precioBase}
      </Typography>
    </CardContent>
  );
};

AuctionItem.TimerSection = ({ duracion, fechaInicio }) => {
  const { t } = useTranslation();
  const now = Date.now();
  const startMs = new Date(fechaInicio).getTime();
  const endMs = startMs + duracion * 1000;

  const shouldCountdown = now >= startMs && now <= endMs;
  const remainingMs = shouldCountdown
    ? useCountdown(duracion, fechaInicio)
    : 0;

  if (now < startMs) {
    const formatted = new Date(fechaInicio).toLocaleString();
    return (
      <CardContent>
        <Typography>
          {t('auction.startsAt')}: {formatted}
        </Typography>
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
      <Typography color="error">
        {t('auction.closed')}
      </Typography>
    </CardContent>
  );
};

AuctionItem.Actions = ({ children }) => {
  
  return (
    <CardActions>
      {children }
    </CardActions>
  );
};
