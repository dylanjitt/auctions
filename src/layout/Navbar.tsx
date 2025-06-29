import React, { useContext, useState } from 'react';
import { AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const { user, setUser } = useContext(UserContext)!;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Optional: if persisting user
    navigate('/login');
  };


  const handleUserHistory = () => navigate('/home/bidHistory');
  const handleUserManagement = () => navigate('/admin/userAdmin');

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Hola, {user?.username}
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            
            {user.rol === 'user' && (
              <Button 
                variant="text" 
                onClick={handleUserHistory}
                sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                Mis Compras
              </Button>
            )}
            
            {user.rol === 'admin' && (
              <Button 
                variant="text" 
                onClick={handleUserManagement}
                sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                Gestión de Usuarios
              </Button>
            )}

            <Box>
              <IconButton onClick={handleAvatarClick} size="small" sx={{ ml: 2 }}>
                <Avatar alt={user.username} src={user.avatar} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </Box>
          </Box>

        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
