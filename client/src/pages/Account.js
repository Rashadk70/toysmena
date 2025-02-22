import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, updatePassword, clearError, clearSuccess } from '../store/slices/userSlice';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Account() {
  const [value, setValue] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await dispatch(updateProfile(profileData));
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await dispatch(updatePassword(passwordData));
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to update password');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleTabChange} centered>
            <Tab label="Profile" />
            <Tab label="Password" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ m: 2 }}>
            {success}
          </Alert>
        )}

        <TabPanel value={value} index={0}>
          <form onSubmit={handleProfileSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">Profile Information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={profileData.address}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <form onSubmit={handlePasswordSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">Change Password</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Password'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
      </Paper>
    </Container>
  );
}
