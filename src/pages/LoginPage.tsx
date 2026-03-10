import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../services/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setTeam } = useAuthStore();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authApi.loginWithGoogle({ id_token: tokenResponse.id_token || '' });
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        if (response.team) {
          localStorage.setItem('team', JSON.stringify(response.team));
          setTeam(response.team);
        }
        setUser(response.user);
        
        const from = location.state?.from?.pathname || (response.team ? '/wizard' : '/onboard');
        navigate(from);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google login failed');
    },
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: '700' }}>Welcome back</h1>
        <p style={{ marginBottom: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>Sign in to ClarityAI</p>

        {error && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '24px',
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid var(--red)',
            borderRadius: 'var(--r-sm)',
            color: 'var(--red)',
            fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={() => googleLogin()}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--r-sm)',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.18s ease',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {loading ? 'Signing in...' : '✓ Sign in with Google'}
        </button>

        <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '500' }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
