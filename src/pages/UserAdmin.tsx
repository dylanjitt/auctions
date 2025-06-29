import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUserAdmin } from '../hooks/useUserAdmin';
import { UserFormDialog } from '../components/UserFormDialog';
import type { User } from '../interfaces/userInterface';

export default function UserAdmin() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUserAdmin();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | undefined>(undefined);

  const handleOpenNew = () => {
    setEditUserId(undefined);
    setDialogOpen(true);
  };
  const handleOpenEdit = (id: string) => {
    setEditUserId(id);
    setDialogOpen(true);
  };
  const onSave = (data: Omit<User,'id'>, id?: string) => {
    if (id) updateUser(id, data);
    else createUser(data);
  };

  return (
    <Box sx={{ p:4 }}>
      <Typography variant="h5" gutterBottom>User Management</Typography>
      <Button variant="contained" onClick={handleOpenNew} sx={{ mb:2 }}>New User</Button>
      {loading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Avatar src={u.avatar} alt={u.username} />
                  </TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.rol}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEdit(u.id)}><EditIcon/></IconButton>
                    <IconButton onClick={() => deleteUser(u.id)}><DeleteIcon/></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <UserFormDialog
        open={dialogOpen}
        initialData={users.find(u => u.id === editUserId)}
        onClose={() => setDialogOpen(false)}
        onSave={onSave}
      />
    </Box>
  );
}