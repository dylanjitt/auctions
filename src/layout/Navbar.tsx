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

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Hola, {user?.username}
        </Typography>

        {user && (
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
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
