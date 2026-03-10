import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../services/auth';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authApi.signupWithGoogle({ id_token: tokenResponse.id_token || '' });
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        
        // Redirect to onboarding to create/select team
        navigate('/onboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Signup failed');
        console.error('Signup error:', err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google signup failed');
    },
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '40px', textAlign: 'center' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            margin: '0 auto 16px'
          }}>
            ✨
          </div>
          <h1 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: '700' }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Get started with ClarityAI</p>
        </div>

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
          onClick={() => googleSignup()}
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
          {loading ? 'Creating account...' : '✓ Sign up with Google'}
        </button>

        <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '500' }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
