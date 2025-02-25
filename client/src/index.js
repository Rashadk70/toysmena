import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import store from './store';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Initialize the app with error handling
const renderApp = () => {
  try {
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
      </React.StrictMode>
    );

    // Remove loading indicator
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Show error UI
    const errorElement = document.querySelector('.error');
    const loadingElement = document.querySelector('.loading');
    if (errorElement && loadingElement) {
      loadingElement.style.display = 'none';
      errorElement.style.display = 'block';
    }
  }
};

// Initialize the app
renderApp();
