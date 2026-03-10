import React, { useRef, useEffect } from 'react';
import type { WizardStep, WizardAnswers } from '../../types';

interface Props {
  step: WizardStep;
  answer: string;
  selectedChoices: string[];
  onAnswer: (value: string) => void;
  onChoice: (label: string) => void;
  hint: string | null;
  hintLoading: boolean;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const QuestionCard: React.FC<Props> = ({
  step, answer, selectedChoices, onAnswer, onChoice,
  hint, hintLoading, onNext, onBack, onSkip, isFirst, isLast,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (step.type === 'textarea') textareaRef.current?.focus();
  }, [step.id, step.type]);

  const canContinue = step.type === 'choice'
    ? selectedChoices.length > 0
    : answer.trim().length >= 3;

  return (
    <div className="question-wrap" key={step.id}>
      <div className="question-meta">
        <span className="q-tag">{step.tag}</span>
        <span className="q-num">Question {step.id} of 10</span>
      </div>

      <h2 className="question-title">{step.title}</h2>
      <p className="question-hint">{step.hint}</p>

      {step.type === 'choice' ? (
        <div className="choices">
          {step.choices?.map(c => (
            <button
              key={c.label}
              className={`choice-btn ${selectedChoices.includes(c.label) ? 'selected' : ''}`}
              onClick={() => onChoice(c.label)}
            >
              {c.icon && <span className="choice-icon">{c.icon}</span>}
              {c.label}
            </button>
          ))}
        </div>
      ) : (
        <>
          {step.suggestions && step.suggestions.length > 0 && (
            <div className="suggestions">
              {step.suggestions.map(s => (
                <button
                  key={s}
                  className="suggestion"
                  onClick={() => onAnswer((answer ? answer + ' ' : '') + s)}
                >
                  + {s}
                </button>
              ))}
            </div>
          )}
          <div className="input-area">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={e => onAnswer(e.target.value)}
              placeholder={step.placeholder}
              rows={4}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) onNext(); }}
            />
            <div className="input-footer">
              <span className="char-count">{answer.length} chars · ⌘↵ to continue</span>
            </div>
          </div>
        </>
      )}

      {hintLoading && (
        <div className="ai-bubble">
          <div className="ai-avatar">⟡</div>
          <div className="ai-text" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="spinner-ring" style={{ width: 16, height: 16, borderWidth: 2 }} />
            <span>Analyzing your input...</span>
          </div>
        </div>
      )}
      {hint && !hintLoading && (
        <div className="ai-bubble">
          <div className="ai-avatar">⟡</div>
          <div className="ai-text">
            <strong>ClarityAI suggests: </strong>{hint}
          </div>
        </div>
      )}

      <div className="nav-row">
        <div className="nav-row-left">
          {!isFirst && (
            <button className="btn btn-back" onClick={onBack}>← Back</button>
          )}
          <button className="btn btn-skip" onClick={onSkip}>Skip</button>
        </div>
        <button className="btn btn-next" onClick={onNext} disabled={!canContinue}>
          {isLast ? '✦ Generate Requirements' : 'Continue →'}
        </button>
      </div>
    </div>
  );
};
