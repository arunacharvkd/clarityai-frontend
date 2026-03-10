import React from 'react';
import { useStore } from '../../store/useStore';
import { TEMPLATES, WIZARD_STEPS } from '../../utils/constants';

export const Sidebar: React.FC = () => {
  const { wizard, setTemplate, setWizardStep, view } = useStore();
  const { currentStep, answers, selectedTemplate } = wizard;

  const filledCount = Object.values(answers).filter(v => v && v.trim().length > 5).length;
  const score = Math.round((filledCount / WIZARD_STEPS.length) * 100);
  const missing = WIZARD_STEPS.filter(s => !answers[s.key] || answers[s.key].trim().length < 5).map(s => s.label);

  const scoreColor = score >= 80 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Template</div>
        <div className="template-grid">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              className={`template-btn ${selectedTemplate === t.id ? 'active' : ''}`}
              onClick={() => setTemplate(t.id)}
            >
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-steps">
        <div className="sidebar-title" style={{ marginBottom: 10, marginTop: 4 }}>Progress</div>
        {WIZARD_STEPS.map(s => {
          const isDone = answers[s.key] && answers[s.key].trim().length > 3;
          const isActive = currentStep === s.id;
          return (
            <div
              key={s.id}
              className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => view === 'wizard' && setWizardStep(s.id)}
            >
              <div className="step-num">{isDone ? '✓' : s.id}</div>
              <div className="step-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="score-widget">
        <div className="score-label">Clarity Score</div>
        <div className="score-value" style={{ color: scoreColor }}>{score}%</div>
        <div className="score-bar-bg">
          <div className="score-bar" style={{ width: `${score}%`, background: `linear-gradient(90deg, #6366f1, ${scoreColor})` }} />
        </div>
        {missing.length > 0 && (
          <div className="score-missing">
            Missing: <span>{missing.slice(0, 3).join(', ')}{missing.length > 3 ? ` +${missing.length - 3}` : ''}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
