import React, { useEffect, useState } from 'react';
import { IRequirement, TemplateType, RequirementStatus } from '../../types';
import { requirementApi } from '../../services/api';
import toast from 'react-hot-toast';

interface HistoryViewProps {
  onOpen: (req: IRequirement) => void;
}

const STATUS_COLORS: Record<RequirementStatus, string> = {
  draft: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  review: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  approved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  archived: 'text-white/25 bg-white/5 border-white/10',
};

const TEMPLATE_ICONS: Record<TemplateType, string> = {
  feature: '✦', bug: '⚡', report: '📊', api: '⬡', dashboard: '◈', automation: '⟳',
};

export const HistoryView: React.FC<HistoryViewProps> = ({ onOpen }) => {
  const [items, setItems] = useState<IRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ total: number; avgCompletenessScore: number } | null>(null);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        requirementApi.getAll({ limit: 50, search: search || undefined }),
        requirementApi.getStats(),
      ]);
      setItems(listRes.data);
      setStats({ total: statsRes.data.total, avgCompletenessScore: statsRes.data.avgCompletenessScore });
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Delete this requirement?')) return;
    try {
      await requirementApi.delete(id);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = items.filter(item =>
    !search ||
    item.generatedRequirement.title.toLowerCase().includes(search.toLowerCase()) ||
    item.wizardAnswers.problem.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-10 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-white mb-1">
            Requirements History
          </h1>
          <p className="text-sm text-white/35">
            {stats?.total || 0} total · Avg clarity score: {stats?.avgCompletenessScore || 0}%
          </p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search requirements..."
          className="px-4 py-2.5 bg-[#13131a] border border-white/8 rounded-xl text-sm text-white/70 placeholder-white/25 outline-none focus:border-indigo-500/40 w-64"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/25">
          <div className="w-6 h-6 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin mr-3" />
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <span className="text-5xl opacity-20">📋</span>
          <p className="text-white/30 text-sm">
            {search ? 'No matching requirements found' : 'No requirements yet. Start the wizard to create one!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map(item => (
            <div
              key={item._id}
              onClick={() => onOpen(item)}
              className="group p-5 bg-[#13131a] border border-white/5 rounded-xl cursor-pointer hover:border-indigo-500/20 hover:bg-[#1a1a24] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-lg flex-shrink-0">
                    {TEMPLATE_ICONS[item.templateType] || '✦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-1 truncate">
                      {item.generatedRequirement.title}
                    </h3>
                    <p className="text-xs text-white/35 leading-relaxed line-clamp-2">
                      {item.wizardAnswers.problem || 'No problem statement'}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${STATUS_COLORS[item.status]}`}>
                        {item.status}
                      </span>
                      <span className="text-[11px] text-emerald-400/70">
                        {item.generatedRequirement.completenessScore}% clarity
                      </span>
                      <span className="text-[11px] text-white/25">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[11px] text-white/25">
                        {item.comments.length} comments
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={e => handleDelete(e, item._id)}
                  className="opacity-0 group-hover:opacity-100 ml-4 text-white/20 hover:text-red-400 text-sm transition-all"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
