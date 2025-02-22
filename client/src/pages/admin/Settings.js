import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tab,
  Tabs,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import ImageUpload from '../../components/common/ImageUpload';

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      sx={{ py: 3 }}
    >
      {value === index && children}
    </Box>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    currency: 'AED',
    logo: '',
    favicon: '',
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: '',
    stripeSecretKey: '',
    codEnabled: true,
    minimumOrderAmount: 0,
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
    smtpSecure: true,
  });

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingEnabled: true,
    freeShippingThreshold: 200,
    defaultShippingCost: 20,
    internationalShippingEnabled: false,
    internationalShippingCost: 100,
    shippingCountries: [],
  });

  // SEO Settings
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmationEnabled: true,
    orderStatusUpdateEnabled: true,
    lowStockNotificationEnabled: true,
    lowStockThreshold: 5,
    newsletterEnabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success) {
        setGeneralSettings(data.settings.general);
        setPaymentSettings(data.settings.payment);
        setEmailSettings(data.settings.email);
        setShippingSettings(data.settings.shipping);
        setSeoSettings(data.settings.seo);
        setNotificationSettings(data.settings.notifications);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          general: generalSettings,
          payment: paymentSettings,
          email: emailSettings,
          shipping: shippingSettings,
          seo: seoSettings,
          notifications: notificationSettings,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Settings saved successfully');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleGeneralChange = (e) => {
    setGeneralSettings({
      ...generalSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPaymentSettings({
      ...paymentSettings,
      [e.target.name]: value,
    });
  };

  const handleEmailChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEmailSettings({
      ...emailSettings,
      [e.target.name]: value,
    });
  };

  const handleShippingChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setShippingSettings({
      ...shippingSettings,
      [e.target.name]: value,
    });
  };

  const handleSeoChange = (e) => {
    setSeoSettings({
      ...seoSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: value,
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Settings</Typography>
        <Box>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchSettings}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="General" />
          <Tab label="Payment" />
          <Tab label="Email" />
          <Tab label="Shipping" />
          <Tab label="SEO" />
          <Tab label="Notifications" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ImageUpload
                value={generalSettings.logo}
                onChange={(url) =>
                  setGeneralSettings({ ...generalSettings, logo: url })
                }
                height={150}
              />
              <Typography variant="caption" color="text.secondary">
                Store Logo (Recommended size: 200x50px)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageUpload
                value={generalSettings.favicon}
                onChange={(url) =>
                  setGeneralSettings({ ...generalSettings, favicon: url })
                }
                height={150}
              />
              <Typography variant="caption" color="text.secondary">
                Favicon (Recommended size: 32x32px)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Store Name"
                name="storeName"
                value={generalSettings.storeName}
                onChange={handleGeneralChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Store Email"
                name="storeEmail"
                type="email"
                value={generalSettings.storeEmail}
                onChange={handleGeneralChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Store Phone"
                name="storePhone"
                value={generalSettings.storePhone}
                onChange={handleGeneralChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Store Address"
                name="storeAddress"
                multiline
                rows={3}
                value={generalSettings.storeAddress}
                onChange={handleGeneralChange}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.stripeEnabled}
                    onChange={handlePaymentChange}
                    name="stripeEnabled"
                  />
                }
                label="Enable Stripe Payments"
              />
            </Grid>
            {paymentSettings.stripeEnabled && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Stripe Public Key"
                    name="stripePublicKey"
                    value={paymentSettings.stripePublicKey}
                    onChange={handlePaymentChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Stripe Secret Key"
                    name="stripeSecretKey"
                    type="password"
                    value={paymentSettings.stripeSecretKey}
                    onChange={handlePaymentChange}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.codEnabled}
                    onChange={handlePaymentChange}
                    name="codEnabled"
                  />
                }
                label="Enable Cash on Delivery"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Order Amount"
                name="minimumOrderAmount"
                type="number"
                value={paymentSettings.minimumOrderAmount}
                onChange={handlePaymentChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">AED</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Host"
                name="smtpHost"
                value={emailSettings.smtpHost}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Port"
                name="smtpPort"
                value={emailSettings.smtpPort}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Username"
                name="smtpUser"
                value={emailSettings.smtpUser}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Password"
                name="smtpPass"
                type="password"
                value={emailSettings.smtpPass}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="From Email"
                name="smtpFrom"
                value={emailSettings.smtpFrom}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailSettings.smtpSecure}
                    onChange={handleEmailChange}
                    name="smtpSecure"
                  />
                }
                label="Use Secure Connection (SSL/TLS)"
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={shippingSettings.freeShippingEnabled}
                    onChange={handleShippingChange}
                    name="freeShippingEnabled"
                  />
                }
                label="Enable Free Shipping"
              />
            </Grid>
            {shippingSettings.freeShippingEnabled && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Free Shipping Threshold"
                  name="freeShippingThreshold"
                  type="number"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={handleShippingChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">AED</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Default Shipping Cost"
                name="defaultShippingCost"
                type="number"
                value={shippingSettings.defaultShippingCost}
                onChange={handleShippingChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">AED</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={shippingSettings.internationalShippingEnabled}
                    onChange={handleShippingChange}
                    name="internationalShippingEnabled"
                  />
                }
                label="Enable International Shipping"
              />
            </Grid>
            {shippingSettings.internationalShippingEnabled && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="International Shipping Cost"
                  name="internationalShippingCost"
                  type="number"
                  value={shippingSettings.internationalShippingCost}
                  onChange={handleShippingChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">AED</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Title"
                name="metaTitle"
                value={seoSettings.metaTitle}
                onChange={handleSeoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Description"
                name="metaDescription"
                multiline
                rows={3}
                value={seoSettings.metaDescription}
                onChange={handleSeoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Keywords"
                name="metaKeywords"
                value={seoSettings.metaKeywords}
                onChange={handleSeoChange}
                helperText="Separate keywords with commas"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Google Analytics ID"
                name="googleAnalyticsId"
                value={seoSettings.googleAnalyticsId}
                onChange={handleSeoChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Facebook Pixel ID"
                name="facebookPixelId"
                value={seoSettings.facebookPixelId}
                onChange={handleSeoChange}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.orderConfirmationEnabled}
                    onChange={handleNotificationChange}
                    name="orderConfirmationEnabled"
                  />
                }
                label="Send Order Confirmation Emails"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.orderStatusUpdateEnabled}
                    onChange={handleNotificationChange}
                    name="orderStatusUpdateEnabled"
                  />
                }
                label="Send Order Status Update Emails"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.lowStockNotificationEnabled}
                    onChange={handleNotificationChange}
                    name="lowStockNotificationEnabled"
                  />
                }
                label="Enable Low Stock Notifications"
              />
            </Grid>
            {notificationSettings.lowStockNotificationEnabled && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Low Stock Threshold"
                  name="lowStockThreshold"
                  type="number"
                  value={notificationSettings.lowStockThreshold}
                  onChange={handleNotificationChange}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.newsletterEnabled}
                    onChange={handleNotificationChange}
                    name="newsletterEnabled"
                  />
                }
                label="Enable Newsletter Subscription"
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default Settings;
