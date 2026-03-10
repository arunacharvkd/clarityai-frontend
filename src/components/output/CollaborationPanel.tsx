import React, { useState } from 'react';
import { IComment, IVersion } from '../../types';

interface CollaborationPanelProps {
  comments: IComment[];
  versions: IVersion[];
  onAddComment: (text: string) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  comments,
  versions,
  onAddComment,
  onDeleteComment,
}) => {
  const [tab, setTab] = useState<'comments' | 'history'>('comments');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    await onAddComment(newComment);
    setNewComment('');
    setSubmitting(false);
  };

  return (
    <aside className="w-[300px] min-w-[300px] border-l border-white/5 bg-[#13131a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-0 border-b border-white/5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-3">
          Collaboration
        </h3>
        <div className="flex gap-0">
          {(['comments', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium capitalize border-b-2 transition-all -mb-px ${
                tab === t
                  ? 'border-indigo-500 text-violet-300'
                  : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              {t === 'comments' ? `Comments (${comments.length})` : 'History'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {tab === 'comments' ? (
          <>
            {comments.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="text-3xl opacity-25">💬</span>
                <p className="text-xs text-white/25">No comments yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {comments.map(c => (
                  <div
                    key={c.id}
                    className="p-3 bg-white/3 border border-white/5 rounded-xl group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                        style={{ background: c.authorColor }}
                      >
                        {c.authorInitials}
                      </div>
                      <span className="text-xs font-medium text-white/70">{c.authorName}</span>
                      <span className="text-[10px] text-white/25 ml-auto">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => onDeleteComment(c.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 text-[10px] transition-all"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {versions.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <span className="text-3xl opacity-25">📋</span>
                <p className="text-xs text-white/25">No versions yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {[...versions].reverse().map(v => (
                  <div key={v.versionNumber} className="p-3 bg-white/3 border border-white/5 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white/70">
                        v{v.versionNumber}
                      </span>
                      <span className="text-[10px] text-white/25">
                        {new Date(v.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/35">{v.note || 'No description'}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Comment input */}
      {tab === 'comments' && (
        <div className="p-3 border-t border-white/5">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a review comment..."
            rows={3}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
            className="w-full bg-white/5 border border-white/8 rounded-lg p-3 text-xs text-white/70 placeholder-white/20 resize-none outline-none focus:border-indigo-500/40 transition-colors"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !newComment.trim()}
            className="mt-2 w-full py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-40"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      )}
    </aside>
  );
};
