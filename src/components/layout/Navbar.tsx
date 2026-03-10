import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { view, setView, resetWizard, currentRequirement } = useStore();

  const isHome = location.pathname === '/';
  const isHistory = location.pathname === '/history';

  return (
    <nav className="nav">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">⟡</div>
        Clarity<span>AI</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className={`btn btn-ghost btn-sm ${isHistory ? 'active' : ''}`}
          onClick={() => navigate('/history')}
        >
          📋 History
        </button>
        {isHome && currentRequirement && (
          <button className="btn btn-ghost btn-sm" onClick={resetWizard}>
            ← New Requirement
          </button>
        )}
        {isHome && (
          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'wizard' ? 'active' : ''}`}
              onClick={() => view !== 'generating' && setView('wizard')}
            >
              Wizard
            </button>
            <button
              className={`view-btn ${view === 'output' ? 'active' : ''}`}
              onClick={() => currentRequirement && setView('output')}
              style={{ opacity: currentRequirement ? 1 : 0.4 }}
            >
              Output
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
