import {type FallbackProps } from 'react-error-boundary';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>{t('error.title')}</Typography>
      <Typography color="error">{error.message}</Typography>
      <Button onClick={resetErrorBoundary} variant="contained" sx={{ mt: 3 }}>
        {t('error.reload')}
      </Button>
    </Box>
  );
}
