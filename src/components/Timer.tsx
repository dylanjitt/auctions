import type { FC } from 'react';
import { Card, Typography } from '@mui/material';

interface TimerProps {
  remainingSeconds: number;
}

const Timer: FC<TimerProps> = ({ remainingSeconds }) => {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return (
    <Card>
      <Typography variant="body1" sx={{padding:1,paddingBottom:0}}>
      Tiempo restante:
    </Typography>
      <Typography variant="h3" sx={{padding:1}}>
      {hours}h : {minutes}m : {seconds}s
    </Typography>
    </Card>
    
  );
};

export default Timer;