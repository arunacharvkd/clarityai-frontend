import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { WizardPage } from './pages/WizardPage';
import { HistoryPage } from './pages/HistoryPage';

const App: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <Routes>
      <Route path="/" element={<WizardPage />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  </div>
);

export default App;
