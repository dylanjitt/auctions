import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { useUserAdmin } from '../hooks/useUserAdmin';
import { UserFormDialog } from '../components/UserFormDialog';
import { UserTable } from '../components/UserTable';
import Toast from '../components/Toast';
import type { User } from '../interfaces/userInterface';
import { useTranslation } from 'react-i18next';

export default function UserAdmin() {
  const { t } = useTranslation();
  const { users, loading, error, createUser, updateUser, deleteUser } = useUserAdmin();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | undefined>(undefined);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  const handleOpenNew = () => {
    setEditUserId(undefined);
    setDialogOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditUserId(id);
    setDialogOpen(true);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const onSave = async (data: Omit<User, 'id'>, id?: string) => {
    try {
      if (id) {
        await updateUser(id, data);
        setToastMessage(t('user.updated'));
      } else {
        await createUser(data);
        setToastMessage(t('user.created'));
      }
      setToastSeverity('success');
      setToastOpen(true);
      setDialogOpen(false);
    } catch {
      setToastMessage(t('user.saveError'));
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setToastMessage(t('user.deleted'));
      setToastSeverity('success');
      setToastOpen(true);
    } catch {
      setToastMessage(t('user.deleteError'));
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t('user.title')}
      </Typography>
      <Button variant="contained" onClick={handleOpenNew} sx={{ mb: 2 }}>
        {t('user.new')}
      </Button>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{t('user.error')} {error}</Typography>
      ) : (
        <UserTable
          users={users}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <UserFormDialog
        open={dialogOpen}
        initialData={users.find(u => u.id === editUserId)}
        onClose={() => setDialogOpen(false)}
        onSave={onSave}
      />

      <Toast
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleCloseToast}
      />
    </Box>
  );
}
