# ToysMena E-commerce Platform

Modern e-commerce platform specializing in educational resources worldwide.

## Features

- Modern React-based frontend with Material-UI
- Node.js/Express backend
- MongoDB database
- JWT Authentication
- Multi-seller marketplace
- Advanced product management
- Smart ordering system
- Responsive design
- Payment gateway integration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Create a .env file with required environment variables
4. Run the development server:
   ```bash
   npm run dev:full
   ```

## Environment Variables

Create a .env file in the root directory with:

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

## Tech Stack

- Frontend: React, Material-UI, Redux
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- Payment: Stripe
- File Upload: Multer
- Cloud Storage: AWS S3
