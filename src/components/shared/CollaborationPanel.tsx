import React, { useState } from 'react';
import { requirementApi } from '../../services/api';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import type { Comment } from '../../types';

interface Props {
  requirementId: string;
  comments: Comment[];
}

export const CollaborationPanel: React.FC<Props> = ({ requirementId, comments: initialComments }) => {
  const { updateCurrentRequirement } = useStore();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments');

  const { currentRequirement } = useStore();

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await requirementApi.addComment(requirementId, text.trim());
      setComments(c => [...c, newComment]);
      setText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="right-panel">
      <div className="right-panel-header">Collaboration</div>
      <div className="tabs">
        <button className={`tab ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>
          Comments ({comments.length})
        </button>
        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          Versions ({currentRequirement?.versions?.length ?? 0})
        </button>
      </div>

      {activeTab === 'comments' ? (
        <>
          <div className="comment-list">
            {comments.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <div className="empty-text">No comments yet. Add a review comment below.</div>
              </div>
            )}
            {comments.map(c => (
              <div key={c._id} className="comment">
                <div className="comment-header">
                  <div className="comment-avatar" style={{ background: c.color }}>{c.initials}</div>
                  <span className="comment-name">{c.author}</span>
                  <span className="comment-time">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
            ))}
          </div>
          <div className="comment-input-area">
            <textarea
              className="comment-input"
              placeholder="Add a review comment..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) submit(); }}
            />
            <button className="comment-submit" onClick={submit} disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </>
      ) : (
        <div className="comment-list">
          {(currentRequirement?.versions ?? []).length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📜</div>
              <div className="empty-text">No version history yet. Versions are saved when you update the requirement.</div>
            </div>
          )}
          {[...(currentRequirement?.versions ?? [])].reverse().map((v, i) => (
            <div key={i} className="comment">
              <div className="comment-header">
                <span className="comment-name">Version {v.versionNumber}</span>
                <span className="comment-time">{new Date(v.savedAt).toLocaleDateString()}</span>
              </div>
              <div className="comment-text">{v.title}</div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
