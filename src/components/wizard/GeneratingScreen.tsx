import React from 'react';

const STEPS = [
  'Analyzing your inputs...',
  'Identifying user stories...',
  'Building acceptance criteria...',
  'Suggesting API endpoints...',
  'Calculating completeness score...',
];

interface Props { completedSteps: number; }

export const GeneratingScreen: React.FC<Props> = ({ completedSteps }) => (
  <div className="generating">
    <div className="spinner-ring" />
    <div>
      <div className="generating-text">Building your requirements...</div>
      <div className="generating-sub" style={{ marginTop: 6 }}>
        AI is analyzing your inputs and generating a structured PRD
      </div>
    </div>
    <div className="generating-steps">
      {STEPS.map((label, i) => (
        <div key={i} className={`gen-step ${completedSteps > i ? 'done' : ''}`}>
          <span className="gen-step-icon">
            {completedSteps > i ? '✓' : completedSteps === i ? '⟳' : '○'}
          </span>
          {label}
        </div>
      ))}
    </div>
  </div>
);
