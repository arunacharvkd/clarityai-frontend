import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { teamApi } from '../services/auth';

type OnboardStep = 'create-or-join' | 'create-team' | 'join-team';

const TeamOnboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setTeam } = useAuthStore();
  const [step, setStep] = useState<OnboardStep>('create-or-join');
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const team = await teamApi.create(teamName, teamDescription);
      localStorage.setItem('team', JSON.stringify(team));
      setTeam(team);
      navigate('/wizard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd verify the join code with the backend
    setError('Join with code coming soon. Ask your team owner to invite you via email.');
  };

  const handleSkip = () => {
    // Create a default personal team
    const defaultTeam = {
      id: `team-${user.id}`,
      name: `${user.name}'s Workspace`,
      ownerId: user.id,
      members: [{ userId: user.id, email: user.email, name: user.name, role: 'owner', joinedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('team', JSON.stringify(defaultTeam));
    setTeam(defaultTeam);
    navigate('/wizard');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ maxWidth: '450px', width: '100%', padding: '40px' }}>
        {step === 'create-or-join' && (
          <div>
            <h1 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: '700' }}>Let's set up your team</h1>
            <p style={{ marginBottom: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
              Welcome, {user.name}! Start collaborating with your team.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setStep('create-team')}
                style={{
                  padding: '16px',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = 'var(--surface3)';
                  el.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = 'var(--surface2)';
                  el.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>+ Create a new team</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Start fresh with a team you own</div>
              </button>

              <button
                onClick={() => setStep('join-team')}
                style={{
                  padding: '16px',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = 'var(--surface3)';
                  el.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = 'var(--surface2)';
                  el.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>📨 Join a team</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get invited to an existing team</div>
              </button>
            </div>

            <button
              onClick={handleSkip}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px 16px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.15s',
              }}
            >
              Skip for now
            </button>
          </div>
        )}

        {step === 'create-team' && (
          <form onSubmit={handleCreateTeam}>
            <button
              type="button"
              onClick={() => setStep('create-or-join')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                marginBottom: '24px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ← Back
            </button>

            <h2 style={{ marginBottom: '8px', fontSize: '20px', fontWeight: '700' }}>Create your team</h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>Give your team a name to get started</p>

            {error && (
              <div style={{
                padding: '12px 16px',
                marginBottom: '16px',
                background: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid var(--red)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--red)',
                fontSize: '13px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>
                Team Name
              </label>
              <input
                type="text"
                placeholder="e.g., Product Team"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>
                Description (optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Building amazing features"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !teamName.trim()}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--r-sm)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading || !teamName.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !teamName.trim() ? 0.6 : 1,
                transition: 'all 0.18s ease',
              }}
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        )}

        {step === 'join-team' && (
          <form onSubmit={handleJoinTeam}>
            <button
              type="button"
              onClick={() => setStep('create-or-join')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                marginBottom: '24px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ← Back
            </button>

            <h2 style={{ marginBottom: '8px', fontSize: '20px', fontWeight: '700' }}>Join a team</h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>Enter the invite code sent by your team owner</p>

            {error && (
              <div style={{
                padding: '12px 16px',
                marginBottom: '16px',
                background: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid var(--red)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--red)',
                fontSize: '13px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>
                Invite Code
              </label>
              <input
                type="text"
                placeholder="e.g., TEAM-ABC123"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !joinCode.trim()}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--r-sm)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading || !joinCode.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !joinCode.trim() ? 0.6 : 1,
                transition: 'all 0.18s ease',
              }}
            >
              {loading ? 'Joining...' : 'Join Team'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeamOnboardPage;
