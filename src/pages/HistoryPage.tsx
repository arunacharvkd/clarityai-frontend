import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requirementApi } from '../services/api';
import { useStore } from '../store/useStore';
import { PRIORITY_COLORS, STATUS_COLORS } from '../utils/constants';
import type { RequirementListItem, Stats } from '../types';
import toast from 'react-hot-toast';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentRequirement, setView } = useStore();
  const [items, setItems] = useState<RequirementListItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('');

  useEffect(() => {
    loadData();
  }, [filterStatus, filterTemplate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        requirementApi.list({ status: filterStatus || undefined, template: filterTemplate || undefined }),
        requirementApi.getStats(),
      ]);
      setItems(listRes.data);
      setStats(statsRes);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const openRequirement = async (id: string) => {
    try {
      const req = await requirementApi.getById(id);
      setCurrentRequirement(req);
      setView('output');
      navigate('/');
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const archive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Archive this requirement?')) return;
    try {
      await requirementApi.remove(id);
      setItems(i => i.filter(r => r._id !== id));
      toast.success('Archived');
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const filtered = items.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="history-page">
      {/* Stats row */}
      {stats && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Requirements</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#34d399' }}>{stats.avgCompleteness}%</div>
            <div className="stat-label">Avg. Completeness</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#fbbf24' }}>{stats.byStatus?.draft ?? 0}</div>
            <div className="stat-label">In Draft</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#22d3ee' }}>{stats.byStatus?.approved ?? 0}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="🔍 Search requirements..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="review">In Review</option>
          <option value="approved">Approved</option>
        </select>
        <select className="filter-select" value={filterTemplate} onChange={e => setFilterTemplate(e.target.value)}>
          <option value="">All Templates</option>
          <option value="feature">New Feature</option>
          <option value="bug">Bug Fix</option>
          <option value="report">Report</option>
          <option value="api">API</option>
          <option value="dashboard">Dashboard</option>
          <option value="automation">Automation</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="generating" style={{ padding: '60px 20px' }}>
          <div className="spinner-ring" />
          <div className="generating-text">Loading...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: '80px 20px' }}>
          <div className="empty-icon">📋</div>
          <div className="empty-text">
            {items.length === 0
              ? 'No requirements yet. Go back and create your first one!'
              : 'No results match your filters.'
            }
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
            + New Requirement
          </button>
        </div>
      ) : (
        <div className="req-list">
          {filtered.map(r => (
            <div key={r._id} className="req-list-item" onClick={() => openRequirement(r._id)}>
              <div className="req-list-left">
                <div className="req-list-title">{r.title}</div>
                <div className="req-list-meta">
                  <span className="req-list-template">{r.template}</span>
                  <span style={{ color: STATUS_COLORS[r.status] || '#7070a0', fontSize: 11 }}>{r.status}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="req-list-right">
                <div className="score-mini" style={{ color: r.completenessScore >= 80 ? '#34d399' : '#fbbf24' }}>
                  {r.completenessScore}%
                </div>
                <span className={`priority-badge priority-${r.priority?.toLowerCase().slice(0,3)}`}>
                  {r.priority}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={e => archive(r._id, e)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
