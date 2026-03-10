import React, { useState } from 'react';
import { ExportBar } from './ExportBar';
import { RequirementSection } from './RequirementSection';
import { requirementApi } from '../../services/api';
import { useStore } from '../../store/useStore';
import { TEMPLATES } from '../../utils/constants';
import toast from 'react-hot-toast';
import type { Requirement } from '../../types';

interface Props { requirement: Requirement; }

export const RequirementOutput: React.FC<Props> = ({ requirement: initialReq }) => {
  const [req, setReq] = useState<Requirement>(initialReq);
  const [saving, setSaving] = useState(false);
  const { updateCurrentRequirement } = useStore();

  const update = (field: keyof Requirement, value: unknown) => {
    setReq(r => ({ ...r, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const updated = await requirementApi.update(req._id, req);
      setReq(updated);
      updateCurrentRequirement(updated);
      toast.success('Saved to database!');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const scoreColor = req.completenessScore >= 80 ? '#34d399' : req.completenessScore >= 50 ? '#fbbf24' : '#f87171';
  const priorityClass = req.priority?.toLowerCase().slice(0, 3) as string;
  const templateLabel = TEMPLATES.find(t => t.id === req.template)?.label ?? req.template;

  return (
    <div className="output-panel">
      <div className="output-header">
        <div>
          <div className="output-title">{req.title}</div>
          <div className="output-meta">
            <span>Template: {templateLabel}</span>
            <div className="meta-dot" />
            <span>{req.estimatedEffort || 'TBD'}</span>
            <div className="meta-dot" />
            <span className={`priority-badge priority-${priorityClass}`}>{req.priority}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div className="score-badge" style={{ color: scoreColor, borderColor: `${scoreColor}33`, background: `${scoreColor}18` }}>
            ✦ {req.completenessScore}% Complete
          </div>
          <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      <ExportBar requirement={req} />

      {/* Problem Statement */}
      <RequirementSection icon="◈" title="Problem Statement" tag="core" tagClass="tag-core" defaultOpen>
        <textarea className="editable-field" value={req.problemStatement} rows={3}
          onChange={e => update('problemStatement', e.target.value)} />
      </RequirementSection>

      {/* Personas */}
      <RequirementSection icon="👤" title="User Personas" tag="ux" tagClass="tag-ux" defaultOpen>
        <div className="criteria-list">
          {req.personas?.map((p, i) => (
            <div key={i} className="criteria-item">
              <span className="criteria-check">◆</span>
              <span><strong style={{ color: 'var(--text)' }}>{p.role}</strong> — {p.description}</span>
            </div>
          ))}
        </div>
      </RequirementSection>

      {/* Feature Description */}
      <RequirementSection icon="✦" title="Feature Description" tag="core" tagClass="tag-core" defaultOpen>
        <textarea className="editable-field" value={req.featureDescription} rows={4}
          onChange={e => update('featureDescription', e.target.value)} />
      </RequirementSection>

      {/* User Stories */}
      <RequirementSection icon="📖" title="User Stories" tag="ux" tagClass="tag-ux" defaultOpen>
        <div className="story-list">
          {req.userStories?.map((s, i) => (
            <div key={i} className="story-item">
              As a <strong>{s.as}</strong>, I want to <strong>{s.iWant}</strong>, so that <strong>{s.soThat}</strong>.
            </div>
          ))}
        </div>
      </RequirementSection>

      {/* Acceptance Criteria */}
      <RequirementSection icon="✓" title="Acceptance Criteria" tag="core" tagClass="tag-core" defaultOpen>
        <div className="criteria-list">
          {req.acceptanceCriteria?.map((c, i) => (
            <div key={i} className="criteria-item">
              <span className="criteria-check">✓</span>
              <span>
                <em style={{ color: 'var(--text-dim)' }}>Given</em> {c.given}{' '}
                <em style={{ color: 'var(--text-dim)' }}>When</em> {c.when}{' '}
                <em style={{ color: 'var(--text-dim)' }}>Then</em> {c.then}
              </span>
            </div>
          ))}
        </div>
      </RequirementSection>

      {/* Business Rules */}
      <RequirementSection icon="⚡" title="Business Rules" tag="core" tagClass="tag-core">
        <div className="criteria-list">
          {req.businessRules?.map((r, i) => (
            <div key={i} className="criteria-item"><span className="criteria-check">→</span><span>{r}</span></div>
          ))}
        </div>
      </RequirementSection>

      {/* Edge Cases */}
      <RequirementSection icon="⚠" title="Edge Cases & Failures" tag="risk" tagClass="tag-risk">
        <div className="criteria-list">
          {req.edgeCases?.map((e, i) => (
            <div key={i} className="criteria-item"><span className="criteria-x">△</span><span>{e}</span></div>
          ))}
        </div>
      </RequirementSection>

      {/* Validation Rules */}
      <RequirementSection icon="🛡" title="Validation Rules" tag="core" tagClass="tag-core">
        <div className="criteria-list">
          {req.validationRules?.map((v, i) => (
            <div key={i} className="criteria-item"><span className="criteria-check">◎</span><span>{v}</span></div>
          ))}
        </div>
      </RequirementSection>

      {/* API Suggestions */}
      <RequirementSection icon="⬡" title="API Suggestions" tag="tech" tagClass="tag-tech">
        <div className="api-list">
          {req.apiSuggestions?.map((a, i) => (
            <div key={i} className="api-item">
              <span className={`method-badge method-${a.method?.toLowerCase()}`}>{a.method}</span>
              <span className="api-path">{a.path}</span>
              <span className="api-desc">{a.description}</span>
            </div>
          ))}
        </div>
      </RequirementSection>

      {/* DB Changes */}
      <RequirementSection icon="🗄" title="Database Changes" tag="tech" tagClass="tag-tech">
        <div className="criteria-list">
          {req.databaseChanges?.map((d, i) => (
            <div key={i} className="criteria-item"><span className="criteria-check">◇</span><span>{d}</span></div>
          ))}
        </div>
      </RequirementSection>

      {/* Technical Notes */}
      <RequirementSection icon="📝" title="Technical Notes" tag="tech" tagClass="tag-tech">
        <div className="criteria-list">
          {req.technicalNotes?.map((n, i) => (
            <div key={i} className="criteria-item"><span className="criteria-check">•</span><span>{n}</span></div>
          ))}
        </div>
      </RequirementSection>

      {/* Missing items */}
      {req.missingItems && req.missingItems.length > 0 && (
        <RequirementSection icon="⚠" title="Missing / Incomplete Items" tag="risk" tagClass="tag-risk">
          <div className="criteria-list">
            {req.missingItems.map((m, i) => (
              <div key={i} className="criteria-item"><span className="criteria-x">!</span><span style={{ color: 'var(--amber)' }}>{m}</span></div>
            ))}
          </div>
        </RequirementSection>
      )}
    </div>
  );
};
