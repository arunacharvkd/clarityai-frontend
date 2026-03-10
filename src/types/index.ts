// ── Domain Types ─────────────────────────────────────────────────────────────

export type TemplateType = 'feature' | 'bug' | 'report' | 'api' | 'dashboard' | 'automation';
export type StatusType   = 'draft' | 'review' | 'approved' | 'archived';
export type PriorityType = 'Critical' | 'High' | 'Medium' | 'Low';
export type MethodType   = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Persona {
  role: string;
  description: string;
}

export interface UserStory {
  as: string;
  iWant: string;
  soThat: string;
}

export interface AcceptanceCriteria {
  given: string;
  when: string;
  then: string;
}

export interface ApiSuggestion {
  method: MethodType;
  path: string;
  description: string;
}

export interface Comment {
  _id: string;
  author: string;
  initials: string;
  color: string;
  text: string;
  createdAt: string;
}

export interface Version {
  versionNumber: number;
  title: string;
  problemStatement: string;
  savedAt: string;
  savedBy: string;
}

export interface WizardAnswers {
  problem:  string;
  users:    string;
  action:   string;
  trigger:  string;
  inputs:   string;
  outputs:  string;
  rules:    string;
  failures: string;
  priority: string;
  success:  string;
}

export interface Requirement {
  _id: string;
  title: string;
  template: TemplateType;
  status: StatusType;
  priority: PriorityType;
  problemStatement: string;
  featureDescription: string;
  personas: Persona[];
  userStories: UserStory[];
  acceptanceCriteria: AcceptanceCriteria[];
  businessRules: string[];
  edgeCases: string[];
  validationRules: string[];
  apiSuggestions: ApiSuggestion[];
  databaseChanges: string[];
  technicalNotes: string[];
  estimatedEffort: string;
  completenessScore: number;
  missingItems: string[];
  wizardAnswers: WizardAnswers;
  comments: Comment[];
  versions: Version[];
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface RequirementListItem {
  _id: string;
  title: string;
  template: TemplateType;
  status: StatusType;
  priority: PriorityType;
  completenessScore: number;
  estimatedEffort: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Stats {
  total: number;
  byStatus: Record<string, number>;
  byTemplate: Record<string, number>;
  avgCompleteness: number;
}

// ── Wizard Step ───────────────────────────────────────────────────────────────

export interface WizardChoice {
  label: string;
  icon?: string;
}

export interface WizardStep {
  id: number;
  key: keyof WizardAnswers;
  label: string;
  tag: string;
  title: string;
  hint: string;
  placeholder?: string;
  suggestions?: string[];
  type: 'textarea' | 'choice';
  choices?: WizardChoice[];
}
