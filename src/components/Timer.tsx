import type { FC } from 'react';
import { Card, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface TimerProps {
  remainingSeconds: number;
}

const Timer: FC<TimerProps> = ({ remainingSeconds }) => {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const { t } = useTranslation();

  return (
    <Card>
      <Typography variant="body1" sx={{padding:1,paddingBottom:0}}>
      {t('timeLeft')}
    </Typography>
      <Typography variant="h3" sx={{padding:1}}>
      {hours}h : {minutes}m : {seconds}s
    </Typography>
    </Card>
    
  );
};

export default Timer;