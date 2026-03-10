import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1a1a24', color: '#f0f0f5', border: '1px solid rgba(255,255,255,0.07)', fontFamily: "'DM Sans', sans-serif", fontSize: 13 },
          success: { iconTheme: { primary: '#34d399', secondary: '#0c0c0f' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#0c0c0f' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
