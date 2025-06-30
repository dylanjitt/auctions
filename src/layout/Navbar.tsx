import React, { useState } from 'react';
import { AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
// import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import GavelIcon from '@mui/icons-material/Gavel';
import { useTranslation } from 'react-i18next';

const NavBar: React.FC = () => {
  // const { user, setUser } = useContext(UserContext)!;
  const {user,logoutUser}=useAuthStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const {t}=useTranslation()


  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logoutUser()
    // localStorage.removeItem('user')
    localStorage.removeItem('auth')
    navigate('/login');
  };

  const goToHome = () =>{
    const redir=user.rol=='user'?'/home':'/admin'
    navigate(redir)
  }

  const handleUserHistory = () => navigate('/home/bidHistory');
  const handleUserManagement = () => navigate('/admin/userAdmin');

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <div style={{display:'flex'}}>
          <div style={{cursor:'pointer'}} onClick={goToHome}>
            <GavelIcon  height={15} sx={{marginRight:2}}/>
          </div>
          
        <Typography variant="h6" component="div">
          {t('hi')} {user?.username}
        </Typography>
        </div>
        

        {user && (
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            
            {user.rol === 'user' && (
              <Button 
                variant="text" 
                onClick={handleUserHistory}
                sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                {t('myBids')}
              </Button>
            )}
            
            {user.rol === 'admin' && (
              <Button 
                variant="text" 
                onClick={handleUserManagement}
                sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                {t('manageUsers')}
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
                <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
              </Menu>
            </Box>
          </Box>

        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
