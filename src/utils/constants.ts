import type { WizardStep, TemplateType } from '../types';

export const TEMPLATES: { id: TemplateType; label: string; icon: string }[] = [
  { id: 'feature',    label: 'New Feature',  icon: '✦' },
  { id: 'bug',        label: 'Bug Fix',       icon: '⚡' },
  { id: 'report',     label: 'Report',        icon: '◈' },
  { id: 'api',        label: 'API',           icon: '⬡' },
  { id: 'dashboard',  label: 'Dashboard',     icon: '▦' },
  { id: 'automation', label: 'Automation',    icon: '⟳' },
];

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1, key: 'problem', label: 'Problem', tag: 'Context',
    title: 'What problem are you trying to solve?',
    hint: 'Describe the pain point or gap in the current system. Be specific about what is broken or missing.',
    placeholder: 'e.g. Users cannot download the monthly sales report from the dashboard...',
    suggestions: ['Data is hard to access', 'Manual process takes too long', 'Missing feature from competitor', 'Current flow is confusing', 'System crashes often'],
    type: 'textarea',
  },
  {
    id: 2, key: 'users', label: 'Users', tag: 'Personas',
    title: 'Who is facing this problem?',
    hint: 'Identify the specific users or roles affected. Consider primary and secondary users.',
    type: 'choice',
    choices: [
      { label: 'Operations Team', icon: '🏢' }, { label: 'Sales Team', icon: '💼' },
      { label: 'Finance', icon: '💰' },         { label: 'Management', icon: '👔' },
      { label: 'End Customers', icon: '👤' },   { label: 'Dev / Engineering', icon: '🛠' },
      { label: 'QA Team', icon: '🔍' },         { label: 'Admin Users', icon: '🔐' },
    ],
  },
  {
    id: 3, key: 'action', label: 'Action', tag: 'Behavior',
    title: 'What should the system do?',
    hint: 'Describe the desired behavior in plain language. What should happen when users interact?',
    placeholder: "e.g. Users should be able to click 'Download' and receive a filtered report as CSV or PDF...",
    suggestions: ['Generate and download a file', 'Show real-time data on screen', 'Send automated notifications', 'Validate and process a form', 'Integrate with third-party service'],
    type: 'textarea',
  },
  {
    id: 4, key: 'trigger', label: 'Trigger', tag: 'Events',
    title: 'When should this happen?',
    hint: 'Define the trigger event — what user action or system event initiates this feature?',
    placeholder: "e.g. When the user clicks 'Export', selects a date range and format, then clicks 'Download'...",
    suggestions: ['On button click', 'On form submit', 'On scheduled timer', 'On data change event', 'On page load', 'On file upload'],
    type: 'textarea',
  },
  {
    id: 5, key: 'inputs', label: 'Inputs', tag: 'Data In',
    title: 'What inputs are required?',
    hint: 'List the data or parameters the user must provide. Think about required vs optional fields.',
    placeholder: 'e.g. Date range (required), Report type (required), Format: CSV/PDF (required), Filter by region (optional)...',
    suggestions: ['Date range picker', 'Dropdown selection', 'Free text search', 'File upload', 'Toggle / checkbox', 'Multi-select filter'],
    type: 'textarea',
  },
  {
    id: 6, key: 'outputs', label: 'Outputs', tag: 'Data Out',
    title: 'What should the system produce?',
    hint: 'Describe the expected output — what the user sees, receives, or what the system does after processing.',
    placeholder: 'e.g. A downloadable Excel file with columns: Date, Region, Sales Rep, Amount, Status...',
    suggestions: ['Downloadable file (CSV/PDF/Excel)', 'Updated dashboard widget', 'Email notification sent', 'Database record created', 'API response returned', 'UI state change'],
    type: 'textarea',
  },
  {
    id: 7, key: 'rules', label: 'Rules', tag: 'Logic',
    title: 'Are there any rules or validations?',
    hint: 'Define business rules, constraints, and validations. Include access control if applicable.',
    placeholder: "e.g. Only users with 'Report Viewer' role can download. Date range cannot exceed 12 months. Max 10,000 rows...",
    suggestions: ['Role-based access control', 'Date range limitation', 'Row/data limit', 'Mandatory field validation', 'Format validation', 'Duplicate prevention'],
    type: 'textarea',
  },
  {
    id: 8, key: 'failures', label: 'Failures', tag: 'Edge Cases',
    title: 'What could go wrong?',
    hint: 'Think about failure modes, edge cases, and unexpected inputs. What should happen in each case?',
    placeholder: 'e.g. If report has 0 rows, show friendly message. If server timeout, show retry option...',
    suggestions: ['Empty state handling', 'Network/timeout errors', 'Invalid input feedback', 'Large dataset performance', 'Concurrent user conflicts', 'Permission denied state'],
    type: 'textarea',
  },
  {
    id: 9, key: 'priority', label: 'Priority', tag: 'Business',
    title: 'What is the priority of this feature?',
    hint: 'Set the urgency and business impact. This helps the team schedule and scope the work.',
    type: 'choice',
    choices: [
      { label: '🔴 Critical — Blocking work' }, { label: '🟠 High — Needed this sprint' },
      { label: '🟡 Medium — Next sprint' },      { label: '🟢 Low — Nice to have' },
    ],
  },
  {
    id: 10, key: 'success', label: 'Success', tag: 'Testing',
    title: 'How do we know the feature works?',
    hint: 'Define the success criteria — specific, testable conditions that confirm the feature is complete.',
    placeholder: 'e.g. Given a user with report access, when they click Download and select last 30 days, then a valid CSV downloads in under 5 seconds...',
    suggestions: ['Download completes in < 3 seconds', 'Data matches source records', 'Works on mobile devices', 'Handles 10,000+ rows without crash', 'Shows error on invalid input', 'Passes UAT with 3 real users'],
    type: 'textarea',
  },
];

export const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#f87171',
  High:     '#fb923c',
  Medium:   '#fbbf24',
  Low:      '#34d399',
};

export const STATUS_COLORS: Record<string, string> = {
  draft:    '#7070a0',
  review:   '#fbbf24',
  approved: '#34d399',
  archived: '#4a4a70',
};
