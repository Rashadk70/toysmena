import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Badge,
  InputBase,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingCart,
  Favorite,
  AccountCircle,
  Search,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const primaryNavItems = [
  { 
    label: 'Early Years',
    link: '/category/early-years',
    items: [
      { label: 'Learning Resources', link: '/category/early-years/learning-resources' },
      { label: 'Toys & Games', link: '/category/early-years/toys-games' },
      { label: 'Arts & Crafts', link: '/category/early-years/arts-crafts' },
      { label: 'Outdoor Play', link: '/category/early-years/outdoor-play' },
    ]
  },
  { 
    label: 'Curricular',
    link: '/category/curricular',
    items: [
      { label: 'Mathematics', link: '/category/curricular/mathematics' },
      { label: 'Science', link: '/category/curricular/science' },
      { label: 'English', link: '/category/curricular/english' },
      { label: 'Languages', link: '/category/curricular/languages' },
    ]
  },
  { 
    label: 'Art & Design',
    link: '/category/art-design',
    items: [
      { label: 'Drawing', link: '/category/art-design/drawing' },
      { label: 'Painting', link: '/category/art-design/painting' },
      { label: 'Craft Materials', link: '/category/art-design/craft' },
      { label: 'Art Equipment', link: '/category/art-design/equipment' },
    ]
  },
  { 
    label: 'Stationery & Office',
    link: '/category/stationery-office',
    items: [
      { label: 'Pens & Pencils', link: '/category/stationery-office/pens-pencils' },
      { label: 'Notebooks & Journals', link: '/category/stationery-office/notebooks-journals' },
      { label: 'Paper & Card', link: '/category/stationery-office/paper-card' },
      { label: 'Office Supplies', link: '/category/stationery-office/office-supplies' },
    ]
  },
  { 
    label: 'Furniture',
    link: '/category/furniture',
    items: [
      { label: 'Classroom Furniture', link: '/category/furniture/classroom' },
      { label: 'Office Furniture', link: '/category/furniture/office' },
      { label: 'Storage & Shelving', link: '/category/furniture/storage-shelving' },
      { label: 'Ergonomic Furniture', link: '/category/furniture/ergonomic' },
    ]
  },
  { 
    label: 'Exercise Books',
    link: '/category/exercise-books',
    items: [
      { label: 'Maths Exercise Books', link: '/category/exercise-books/maths' },
      { label: 'English Exercise Books', link: '/category/exercise-books/english' },
      { label: 'Science Exercise Books', link: '/category/exercise-books/science' },
      { label: 'Other Exercise Books', link: '/category/exercise-books/other' },
    ]
  },
  { 
    label: 'Sport',
    link: '/category/sport',
    items: [
      { label: 'Team Sports', link: '/category/sport/team-sports' },
      { label: 'Individual Sports', link: '/category/sport/individual-sports' },
      { label: 'Sporting Equipment', link: '/category/sport/equipment' },
      { label: 'Sports Apparel', link: '/category/sport/apparel' },
    ]
  },
  { 
    label: 'Science',
    link: '/category/science',
    items: [
      { label: 'Biology', link: '/category/science/biology' },
      { label: 'Chemistry', link: '/category/science/chemistry' },
      { label: 'Physics', link: '/category/science/physics' },
      { label: 'Other Science', link: '/category/science/other' },
    ]
  },
  { 
    label: 'SEN',
    link: '/category/sen',
    items: [
      { label: 'Autism Resources', link: '/category/sen/autism' },
      { label: 'ADHD Resources', link: '/category/sen/adhd' },
      { label: 'Dyslexia Resources', link: '/category/sen/dyslexia' },
      { label: 'Other SEN Resources', link: '/category/sen/other' },
    ]
  },
  { 
    label: 'Facilities',
    link: '/category/facilities',
    items: [
      { label: 'Cafeteria & Dining', link: '/category/facilities/cafeteria-dining' },
      { label: 'Toilets & Hygiene', link: '/category/facilities/toilets-hygiene' },
      { label: 'Playgrounds & Outdoor', link: '/category/facilities/playgrounds-outdoor' },
      { label: 'Other Facilities', link: '/category/facilities/other' },
    ]
  },
  { 
    label: 'IT & Hardware',
    link: '/category/it-hardware',
    items: [
      { label: 'Computers & Laptops', link: '/category/it-hardware/computers-laptops' },
      { label: 'Tablets & iPads', link: '/category/it-hardware/tablets-ipads' },
      { label: 'Software & Apps', link: '/category/it-hardware/software-apps' },
      { label: 'Other IT & Hardware', link: '/category/it-hardware/other' },
    ]
  },
];

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: 'none',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  padding: theme.spacing(1),
  textTransform: 'none',
  fontSize: '0.875rem',
  minHeight: 40,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const TopBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(0.75, 0),
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 500,
  height: 32,
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  margin: '0 auto',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
  fontSize: '0.875rem',
}));

const SearchButton = styled(Button)(({ theme }) => ({
  padding: '4px 12px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: '0 4px 4px 0',
  textTransform: 'none',
  fontSize: '0.875rem',
  minWidth: 'unset',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledMenu = styled(MenuList)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(1),
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: theme.spacing(0.75, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMenuOpen = (event, menuId) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(menuId);
  };

  const handleMenuClose = () => {
    setOpenMenuId(null);
    setAnchorEl(null);
  };

  return (
    <>
      <TopBar>
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1,
              minHeight: 'unset'
            }}
          >
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 0.5
            }}>
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                }}
              >
                ToysMena
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  to="/wishlist"
                  sx={{ padding: 0.5 }}
                >
                  <Badge 
                    badgeContent={wishlistItems.length} 
                    color="error"
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: 14, minWidth: 14 } }}
                  >
                    <Favorite sx={{ fontSize: '1.1rem' }} />
                  </Badge>
                </IconButton>
                
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  to="/cart"
                  sx={{ padding: 0.5 }}
                >
                  <Badge 
                    badgeContent={cartItems.length} 
                    color="error"
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: 14, minWidth: 14 } }}
                  >
                    <ShoppingCart sx={{ fontSize: '1.1rem' }} />
                  </Badge>
                </IconButton>

                {user ? (
                  <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                      <IconButton 
                        onClick={handleOpenUserMenu}
                        sx={{ padding: 0.5 }}
                      >
                        <Avatar 
                          alt={user.name} 
                          src={user.avatar}
                          sx={{ width: 24, height: 24 }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {user.role === 'admin' && (
                        <MenuItem component={Link} to="/admin">
                          Admin Dashboard
                        </MenuItem>
                      )}
                      <MenuItem component={Link} to="/account">
                        My Account
                      </MenuItem>
                      <MenuItem component={Link} to="/orders">
                        My Orders
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </Box>
                ) : (
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    startIcon={<AccountCircle sx={{ fontSize: '1.1rem' }} />}
                    sx={{ 
                      padding: '2px 6px',
                      fontSize: '0.875rem',
                      minWidth: 'unset'
                    }}
                  >
                    Login
                  </Button>
                )}
              </Box>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>
              <form onSubmit={handleSearch} style={{ width: '100%' }}>
                <SearchBar>
                  <SearchInput
                    placeholder="Search for a product"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchButton type="submit" variant="contained" endIcon={<Search sx={{ fontSize: '1rem' }} />}>
                    Search
                  </SearchButton>
                </SearchBar>
              </form>
            </Box>
          </Toolbar>
        </Container>
      </TopBar>

      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'center', minHeight: 40 }}>
            {primaryNavItems.map((item, index) => (
              <Box key={item.label}>
                <NavButton
                  component={Link}
                  to={item.link}
                  endIcon={<KeyboardArrowDown />}
                  onClick={(e) => handleMenuOpen(e, index)}
                >
                  {item.label}
                </NavButton>
                <Popper
                  open={openMenuId === index}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                  transition
                  disablePortal
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper>
                        <ClickAwayListener onClickAway={handleMenuClose}>
                          <StyledMenu>
                            {item.items?.map((subItem) => (
                              <StyledMenuItem
                                key={subItem.label}
                                component={Link}
                                to={subItem.link}
                                onClick={handleMenuClose}
                              >
                                {subItem.label}
                              </StyledMenuItem>
                            ))}
                          </StyledMenu>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>
            ))}
          </Toolbar>
        </Container>
      </StyledAppBar>
    </>
  );
}
