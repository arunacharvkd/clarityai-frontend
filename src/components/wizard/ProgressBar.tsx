import React from 'react';
import { WIZARD_STEPS } from '../../utils/constants';
import type { WizardAnswers } from '../../types';

interface Props {
  currentStep: number;
  answers: WizardAnswers;
}

export const ProgressBar: React.FC<Props> = ({ currentStep, answers }) => (
  <div className="progress-track">
    {WIZARD_STEPS.map(s => {
      const isDone = answers[s.key] && answers[s.key].trim().length > 3;
      const isActive = currentStep === s.id;
      return (
        <div
          key={s.id}
          className={`progress-step ${isDone ? 'done' : isActive ? 'active' : ''}`}
        />
      );
    })}
    <span className="progress-label">{currentStep}/{WIZARD_STEPS.length}</span>
  </div>
);
