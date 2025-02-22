import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
} from '@mui/icons-material';

const brands = [
  'Clickety Books',
  'Davies Sport',
  'Dryad',
  'Dryad Big Book',
  'Findel',
  'Hope Education',
  'LDA',
  'Normans',
  'Wildgoose',
  'Surestitch',
  'Specialist Crafts',
];

const companyLinks = [
  { text: 'About', path: '/about' },
  { text: 'Contact Us', path: '/contact' },
  { text: 'Delivery', path: '/delivery' },
  { text: 'Meet The Team', path: '/team' },
  { text: 'Smart Ordering', path: '/smart-ordering' },
  { text: 'CSR', path: '/csr' },
  { text: 'Gender Pay Gap Report', path: '/gender-pay-gap' },
];

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              ToysMena
            </Typography>
            <Typography variant="body2">
              Specialists in educational resources worldwide.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Our Brands
            </Typography>
            <Grid container>
              {brands.map((brand) => (
                <Grid item xs={6} key={brand}>
                  <Link
                    component={RouterLink}
                    to={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                    color="inherit"
                    sx={{ display: 'block', mb: 1 }}
                  >
                    {brand}
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            {companyLinks.map((link) => (
              <Link
                key={link.text}
                component={RouterLink}
                to={link.path}
                color="inherit"
                sx={{ display: 'block', mb: 1 }}
              >
                {link.text}
              </Link>
            ))}
            <Typography variant="body2" sx={{ mt: 2 }}>
              Contact: info@toysmena.com
            </Typography>
            <Typography variant="body2">
              Website: toysmena.com
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} ToysMena. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
