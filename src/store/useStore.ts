import { create } from 'zustand';
import type { Requirement, RequirementListItem, WizardAnswers, TemplateType, Stats } from '../types';

interface WizardState {
  currentStep: number;
  answers: WizardAnswers;
  selectedTemplate: TemplateType;
  selectedChoices: Record<number, string[]>;
}

interface AppState {
  wizard: WizardState;
  setWizardStep: (step: number) => void;
  setAnswer: (key: keyof WizardAnswers, value: string) => void;
  setTemplate: (t: TemplateType) => void;
  setChoice: (stepId: number, choices: string[]) => void;
  resetWizard: () => void;
  requirements: RequirementListItem[];
  setRequirements: (r: RequirementListItem[]) => void;
  currentRequirement: Requirement | null;
  setCurrentRequirement: (r: Requirement | null) => void;
  updateCurrentRequirement: (updates: Partial<Requirement>) => void;
  stats: Stats | null;
  setStats: (s: Stats) => void;
  view: 'wizard' | 'generating' | 'output';
  setView: (v: 'wizard' | 'generating' | 'output') => void;
}

const defaultAnswers: WizardAnswers = {
  problem: '', users: '', action: '', trigger: '',
  inputs: '', outputs: '', rules: '', failures: '',
  priority: '', success: '',
};

const defaultWizard: WizardState = {
  currentStep: 1,
  answers: defaultAnswers,
  selectedTemplate: 'feature',
  selectedChoices: {},
};

export const useStore = create<AppState>((set) => ({
  wizard: defaultWizard,
  setWizardStep: (step) => set(s => ({ wizard: { ...s.wizard, currentStep: step } })),
  setAnswer: (key, value) => set(s => ({ wizard: { ...s.wizard, answers: { ...s.wizard.answers, [key]: value } } })),
  setTemplate: (t) => set(s => ({ wizard: { ...s.wizard, selectedTemplate: t } })),
  setChoice: (stepId, choices) => set(s => ({ wizard: { ...s.wizard, selectedChoices: { ...s.wizard.selectedChoices, [stepId]: choices } } })),
  resetWizard: () => set({ wizard: defaultWizard, view: 'wizard', currentRequirement: null }),
  requirements: [],
  setRequirements: (requirements) => set({ requirements }),
  currentRequirement: null,
  setCurrentRequirement: (r) => set({ currentRequirement: r }),
  updateCurrentRequirement: (updates) => set(s => ({
    currentRequirement: s.currentRequirement ? { ...s.currentRequirement, ...updates } : null
  })),
  stats: null,
  setStats: (stats) => set({ stats }),
  view: 'wizard',
  setView: (view) => set({ view }),
}));
