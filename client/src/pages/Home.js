import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Favorite as HeartIcon, ShoppingCart as BasketIcon } from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero-bg.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const brandLogos = [
  'Hope Education',
  'Philip Harris',
  'Davies Sports',
  'LDA',
  'Normans',
  'Wildgoose',
  'Specialist Crafts',
  'Surestitch',
];

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Typography variant="h2" gutterBottom>
            Specialists in educational resources worldwide.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
            component={RouterLink}
            to="/products"
          >
            Find out more
          </Button>
        </Container>
      </HeroSection>

      {/* Brand Logos Section */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Trusted Brands
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {brandLogos.map((brand) => (
            <Grid item key={brand} xs={6} sm={3} md={1.5}>
              <Box
                component="img"
                src={`/images/brands/${brand.toLowerCase().replace(/\s+/g, '-')}.png`}
                alt={brand}
                sx={{ width: '100%', height: 'auto', filter: 'grayscale(100%)', opacity: 0.7 }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `<Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 'medium' }}>{brand}</Typography>`;
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Smart Ordering Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Smart Ordering System
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <HeartIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Wishlists
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Save your favorite items for later
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <BasketIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Share Basket
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Share cart contents with team members
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Sections */}
      <Container sx={{ my: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <CardMedia
                component="img"
                height="200"
                image="/images/team.jpg"
                alt="Meet the team"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `<Skeleton variant="rectangular" width="100%" height={200} />`;
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Meet the team
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/team"
                >
                  Find out more
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <CardMedia
                component="img"
                height="200"
                image="/images/digital-catalogues.jpg"
                alt="Digital catalogues"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `<Skeleton variant="rectangular" width="100%" height={200} />`;
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Digital catalogues
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/catalogues"
                >
                  Click here
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <CardMedia
                component="img"
                height="200"
                image="/images/delivery.jpg"
                alt="Consolidated delivery"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `<Skeleton variant="rectangular" width="100%" height={200} />`;
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consolidated delivery
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/delivery"
                >
                  Find out more
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
