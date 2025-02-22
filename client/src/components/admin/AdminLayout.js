import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
  Store as SellersIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Orders', icon: <OrdersIcon />, path: '/admin/orders' },
  { text: 'Products', icon: <ProductsIcon />, path: '/admin/products' },
  { text: 'Users', icon: <UsersIcon />, path: '/admin/users' },
  { text: 'Sellers', icon: <SellersIcon />, path: '/admin/sellers' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ToysMena Admin
          </Typography>
          <IconButton onClick={handleProfileMenuOpen}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => navigate('/admin/profile')}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(open ? {} : {
              width: theme => theme.spacing(7),
              overflowX: 'hidden',
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItem>
            ))}
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Logout" />}
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default AdminLayout;
