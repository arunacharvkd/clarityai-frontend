import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { ProgressBar } from '../components/wizard/ProgressBar';
import { QuestionCard } from '../components/wizard/QuestionCard';
import { GeneratingScreen } from '../components/wizard/GeneratingScreen';
import { RequirementOutput } from '../components/output/RequirementOutput';
import { CollaborationPanel } from '../components/shared/CollaborationPanel';
import { useStore } from '../store/useStore';
import { useRequirements } from '../hooks/useRequirements';
import { useAIHint } from '../hooks/useAIHint';
import { WIZARD_STEPS } from '../utils/constants';

export const WizardPage: React.FC = () => {
  const { wizard, view, setView, setWizardStep, setAnswer, setChoice, currentRequirement } = useStore();
  const { currentStep, answers, selectedTemplate, selectedChoices } = wizard;
  const { generate } = useRequirements();
  const { hint, loading: hintLoading, requestHint, clearHint } = useAIHint();
  const [genSteps, setGenSteps] = useState(0);

  const step = WIZARD_STEPS[currentStep - 1];

  // Request AI hints as user types
  useEffect(() => {
    if (step.type === 'textarea') {
      requestHint(step.label, answers[step.key] || '');
    }
  }, [answers[step.key], step.id]);

  const handleAnswer = (value: string) => {
    setAnswer(step.key, value);
    clearHint();
  };

  const handleChoice = (label: string) => {
    const curr = selectedChoices[currentStep] || [];
    const next = curr.includes(label) ? curr.filter(c => c !== label) : [...curr, label];
    setChoice(currentStep, next);
    setAnswer(step.key, next.join(', '));
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setWizardStep(currentStep + 1);
      clearHint();
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setWizardStep(currentStep - 1);
  };

  const handleSkip = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setWizardStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const handleGenerate = async () => {
    setView('generating');
    setGenSteps(0);
    // Animate steps while API call runs
    const animInterval = setInterval(() => {
      setGenSteps(s => {
        if (s >= 5) { clearInterval(animInterval); return s; }
        return s + 1;
      });
    }, 700);
    await generate(answers, selectedTemplate);
    clearInterval(animInterval);
    setGenSteps(5);
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="content">
        {view === 'wizard' && (
          <div className="wizard">
            <ProgressBar currentStep={currentStep} answers={answers} />
            <QuestionCard
              step={step}
              answer={answers[step.key] || ''}
              selectedChoices={selectedChoices[currentStep] || []}
              onAnswer={handleAnswer}
              onChoice={handleChoice}
              hint={hint}
              hintLoading={hintLoading}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
              isFirst={currentStep === 1}
              isLast={currentStep === WIZARD_STEPS.length}
            />
          </div>
        )}
        {view === 'generating' && <GeneratingScreen completedSteps={genSteps} />}
        {view === 'output' && currentRequirement && (
          <RequirementOutput requirement={currentRequirement} />
        )}
      </div>
      {view === 'output' && currentRequirement && (
        <CollaborationPanel
          requirementId={currentRequirement._id}
          comments={currentRequirement.comments || []}
        />
      )}
    </div>
  );
};
