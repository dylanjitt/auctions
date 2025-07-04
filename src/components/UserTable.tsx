import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { User } from '../interfaces/userInterface';
import { useTranslation } from 'react-i18next';

interface UserTableProps {
  users: User[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (users.length === 0) {
    return <Typography>{t('user.noUsers')}</Typography>;
  }

  return (
    <TableContainer sx={{ width: '80vh' }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('user.avatar')}</TableCell>
            <TableCell>{t('user.username')}</TableCell>
            <TableCell>{t('user.role')}</TableCell>
            <TableCell>{t('user.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <Avatar src={u.avatar} alt={u.username} />
              </TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.rol}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(u.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(u.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
