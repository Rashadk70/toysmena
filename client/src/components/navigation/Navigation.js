import React from 'react';
import {
  Box,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const secondaryNavItems = [
  { label: 'Shop by Seller', link: '/sellers' },
  { label: 'Clerkery Books', link: '/clerkery-books' },
  { label: 'Dryad Big Book', link: '/dryad-big-book' },
  { label: 'Dryad Education', link: '/dryad-education' },
  { label: 'Findel Education', link: '/findel-education' },
  { label: 'Normans Music', link: '/normans-music' },
  { label: 'Specialist Crafts', link: '/specialist-crafts' },
  { label: 'Samaritan', link: '/samaritan' },
  { label: 'Wildgoose', link: '/wildgoose' },
];

const SecondaryNav = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
}));

const SecondaryNavButton = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: theme.spacing(0.5, 2),
  fontSize: '0.875rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

export default function Navigation() {
  return (
    <SecondaryNav>
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {secondaryNavItems.map((item) => (
          <SecondaryNavButton
            key={item.label}
            to={item.link}
          >
            {item.label}
          </SecondaryNavButton>
        ))}
      </Container>
    </SecondaryNav>
  );
}
