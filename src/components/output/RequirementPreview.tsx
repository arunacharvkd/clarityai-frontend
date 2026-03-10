import React, { useState, useCallback } from 'react';
import { IRequirement, IGeneratedRequirement } from '../../types';
import toast from 'react-hot-toast';

interface RequirementPreviewProps {
  requirement: IRequirement;
  onUpdate: (payload: {
    generatedRequirement?: IGeneratedRequirement;
    status?: IRequirement['status'];
    versionNote?: string;
  }) => Promise<void>;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section: React.FC<{
  icon: string;
  title: string;
  tag: string;
  tagColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ icon, title, tag, tagColor, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden mb-3 hover:border-indigo-500/15 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-[#13131a] text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm">{icon}</span>
          <span className="font-display text-sm font-semibold text-white">{title}</span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ color: tagColor, background: `${tagColor}18` }}
          >
            {tag}
          </span>
        </div>
        <span className={`text-white/25 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="px-4 py-4 bg-[#1a1a24] border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Editable textarea ────────────────────────────────────────────────────────
const EditableText: React.FC<{
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}> = ({ value, onChange, rows = 3 }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    className="w-full bg-[#22222f] border border-white/8 rounded-lg px-3.5 py-3 text-sm text-white/80 leading-relaxed resize-y outline-none focus:border-indigo-500/50 transition-colors"
  />
);

// ─── Main component ───────────────────────────────────────────────────────────
export const RequirementPreview: React.FC<RequirementPreviewProps> = ({
  requirement,
  onUpdate,
}) => {
  const [req, setReq] = useState<IGeneratedRequirement>(
    JSON.parse(JSON.stringify(requirement.generatedRequirement))
  );
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({ generatedRequirement: req, versionNote: 'Manual edit' });
    setSaving(false);
  };

  const copyFormat = useCallback(
    (format: string) => {
      let text = '';
      if (format === 'markdown') {
        text = `# ${req.title}\n\n## Problem Statement\n${req.problemStatement}\n\n## Feature Description\n${req.featureDescription}\n\n## User Stories\n${req.userStories.map(s => `- As a **${s.as}**, I want to **${s.iWant}**, so that **${s.soThat}**`).join('\n')}\n\n## Acceptance Criteria\n${req.acceptanceCriteria.map(c => `- **Given** ${c.given} **When** ${c.when} **Then** ${c.then}`).join('\n')}\n\n## Business Rules\n${req.businessRules.map(r => `- ${r}`).join('\n')}\n\n## Edge Cases\n${req.edgeCases.map(e => `- ${e}`).join('\n')}\n\n## API Suggestions\n${req.apiSuggestions.map(a => `- \`${a.method} ${a.path}\` — ${a.description}`).join('\n')}\n\n---\n**Priority:** ${req.priority} | **Effort:** ${req.estimatedEffort} | **Score:** ${req.completenessScore}%`;
      } else if (format === 'json') {
        text = JSON.stringify(req, null, 2);
      } else if (format === 'jira') {
        text = `**Summary:** ${req.title}\n**Priority:** ${req.priority}\n**Estimate:** ${req.estimatedEffort}\n\n**Problem Statement:**\n${req.problemStatement}\n\n**Acceptance Criteria:**\n${req.acceptanceCriteria.map((c, i) => `${i + 1}. Given ${c.given}, When ${c.when}, Then ${c.then}`).join('\n')}\n\n**Business Rules:**\n${req.businessRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
      } else {
        text = `${req.title}\n\n${req.featureDescription}\n\nPriority: ${req.priority} | Effort: ${req.estimatedEffort} | Score: ${req.completenessScore}%`;
      }
      navigator.clipboard.writeText(text).catch(() => {});
      setCopied(format);
      toast.success(`Copied as ${format.toUpperCase()}`);
      setTimeout(() => setCopied(null), 2000);
    },
    [req]
  );

  const priorityClass = {
    Critical: 'text-red-400 bg-red-400/10 border-red-400/20',
    High: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  }[req.priority] || 'text-amber-400 bg-amber-400/10 border-amber-400/20';

  return (
    <div className="flex-1 overflow-y-auto px-10 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-white mb-2">
            {req.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-white/30">
            <span>Template: {requirement.templateType}</span>
            <span>·</span>
            <span>{req.estimatedEffort}</span>
            <span>·</span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${priorityClass}`}>
              {req.priority}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-xs font-semibold text-emerald-400">
            ✦ {req.completenessScore}% Complete
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : '💾 Save'}
          </button>
        </div>
      </div>

      {/* Export bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ['markdown', '⬇ Markdown'],
          ['json', '⬇ JSON'],
          ['jira', '⬇ Jira'],
          ['prd', '⬇ PRD'],
        ].map(([fmt, label]) => (
          <button
            key={fmt}
            onClick={() => copyFormat(fmt)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
              copied === fmt
                ? 'border-emerald-400/40 text-emerald-400 bg-emerald-400/8'
                : 'border-white/8 text-white/40 hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/5'
            }`}
          >
            {copied === fmt ? '✓ Copied!' : label}
          </button>
        ))}
      </div>

      {/* Sections */}
      <Section icon="◈" title="Problem Statement" tag="core" tagColor="#a78bfa" defaultOpen>
        <EditableText value={req.problemStatement} onChange={v => setReq(r => ({ ...r, problemStatement: v }))} rows={3} />
      </Section>

      <Section icon="✦" title="Feature Description" tag="core" tagColor="#a78bfa" defaultOpen>
        <EditableText value={req.featureDescription} onChange={v => setReq(r => ({ ...r, featureDescription: v }))} rows={4} />
      </Section>

      <Section icon="👤" title="User Personas" tag="ux" tagColor="#22d3ee">
        <div className="flex flex-col gap-2">
          {req.personas.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-[#22222f] rounded-lg border-l-2 border-cyan-400/40">
              <span className="text-cyan-400 mt-0.5">◆</span>
              <div>
                <div className="text-sm font-semibold text-white">{p.role}</div>
                <div className="text-xs text-white/45 mt-0.5">{p.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="📖" title="User Stories" tag="ux" tagColor="#22d3ee">
        <div className="flex flex-col gap-2">
          {req.userStories.map((s, i) => (
            <div key={i} className="p-3.5 bg-[#22222f] rounded-lg border-l-3 border-indigo-500/50 text-sm text-white/55 leading-relaxed">
              As a <strong className="text-white">{s.as}</strong>, I want to{' '}
              <strong className="text-white">{s.iWant}</strong>, so that{' '}
              <strong className="text-white">{s.soThat}</strong>.
            </div>
          ))}
        </div>
      </Section>

      <Section icon="✓" title="Acceptance Criteria" tag="core" tagColor="#a78bfa" defaultOpen>
        <div className="flex flex-col gap-2">
          {req.acceptanceCriteria.map((c, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-white/50 leading-relaxed">
              <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
              <span>
                <em className="text-white/30 not-italic">Given</em> {c.given}{' '}
                <em className="text-white/30 not-italic">When</em> {c.when}{' '}
                <em className="text-white/30 not-italic">Then</em> {c.then}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="⚡" title="Business Rules" tag="core" tagColor="#a78bfa">
        <div className="flex flex-col gap-1.5">
          {req.businessRules.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-white/50">
              <span className="text-indigo-400 mt-0.5">→</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="⚠" title="Edge Cases" tag="risk" tagColor="#f87171">
        <div className="flex flex-col gap-1.5">
          {req.edgeCases.map((e, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-white/50">
              <span className="text-red-400 mt-0.5">△</span>
              <span>{e}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="✔" title="Validation Rules" tag="logic" tagColor="#fbbf24">
        <div className="flex flex-col gap-1.5">
          {req.validationRules.map((v, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-white/50">
              <span className="text-amber-400 mt-0.5">◇</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="⬡" title="API Suggestions" tag="tech" tagColor="#fbbf24">
        <div className="flex flex-col gap-2">
          {req.apiSuggestions.map((a, i) => {
            const colors: Record<string, string> = {
              GET: 'text-emerald-400 bg-emerald-400/12',
              POST: 'text-indigo-400 bg-indigo-400/12',
              PUT: 'text-amber-400 bg-amber-400/12',
              DELETE: 'text-red-400 bg-red-400/12',
              PATCH: 'text-cyan-400 bg-cyan-400/12',
            };
            return (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-[#22222f] rounded-lg text-sm">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${colors[a.method] || ''}`}>
                  {a.method}
                </span>
                <code className="text-white/80 text-xs">{a.path}</code>
                <span className="text-white/30 text-xs ml-auto">{a.description}</span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section icon="🗄" title="Database Changes" tag="tech" tagColor="#fbbf24">
        <div className="flex flex-col gap-1.5">
          {req.databaseChanges.map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-white/50">
              <span className="text-amber-400 mt-0.5">◇</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="📝" title="Technical Notes" tag="tech" tagColor="#fbbf24">
        <div className="flex flex-col gap-1.5">
          {req.technicalNotes.map((n, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-white/50">
              <span className="text-white/25">•</span>
              <span>{n}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};
