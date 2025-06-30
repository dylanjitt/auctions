// src/pages/UserAdmin.tsx
import React, { useState } from 'react';
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

export default function UserAdmin() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUserAdmin();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | undefined>(undefined);

  // Toast state
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
        setToastMessage('Usuario actualizado con éxito');
      } else {
        await createUser(data);
        setToastMessage('Usuario creado con éxito');
      }
      setToastSeverity('success');
      setToastOpen(true);
      setDialogOpen(false);
    } catch {
      setToastMessage('Error al guardar usuario');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setToastMessage('Usuario eliminado con éxito');
      setToastSeverity('success');
      setToastOpen(true);
    } catch {
      setToastMessage('Error al eliminar usuario');
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" onClick={handleOpenNew} sx={{ mb: 2 }}>
        New User
      </Button>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
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
