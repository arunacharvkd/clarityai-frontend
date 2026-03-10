import React, { useState } from 'react';
import type { Requirement } from '../../types';

interface Props { requirement: Requirement; }

export const ExportBar: React.FC<Props> = ({ requirement: r }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const formats: [string, string, () => string][] = [
    ['markdown', '⬇ Markdown', () =>
      `# ${r.title}\n\n## Problem Statement\n${r.problemStatement}\n\n## Feature Description\n${r.featureDescription}\n\n## User Stories\n${r.userStories.map(s => `- As a ${s.as}, I want to ${s.iWant}, so that ${s.soThat}`).join('\n')}\n\n## Acceptance Criteria\n${r.acceptanceCriteria.map(c => `- Given ${c.given}, when ${c.when}, then ${c.then}`).join('\n')}\n\n## Business Rules\n${r.businessRules.map(x => `- ${x}`).join('\n')}\n\n## Edge Cases\n${r.edgeCases.map(x => `- ${x}`).join('\n')}`
    ],
    ['json', '⬇ JSON', () => JSON.stringify(r, null, 2)],
    ['jira', '⬇ Jira', () =>
      `*Summary:* ${r.title}\n*Priority:* ${r.priority}\n*Effort:* ${r.estimatedEffort}\n\n*Description:*\n${r.problemStatement}\n\n*Acceptance Criteria:*\n${r.acceptanceCriteria.map((c, i) => `${i + 1}. Given ${c.given}, When ${c.when}, Then ${c.then}`).join('\n')}`
    ],
    ['prd', '⬇ PRD Text', () =>
      `PRODUCT REQUIREMENT DOCUMENT\n${'='.repeat(40)}\n\nTitle: ${r.title}\nPriority: ${r.priority}\nEstimated Effort: ${r.estimatedEffort}\nCompleteness: ${r.completenessScore}%\n\nPROBLEM STATEMENT\n${r.problemStatement}\n\nFEATURE DESCRIPTION\n${r.featureDescription}`
    ],
  ];

  const copy = async (format: string, getText: () => string) => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* fallback for non-https */ }
  };

  return (
    <div className="export-bar">
      {formats.map(([format, label, getText]) => (
        <button
          key={format}
          className={`export-btn ${copied === format ? 'copied' : ''}`}
          onClick={() => copy(format, getText)}
        >
          {copied === format ? '✓ Copied!' : label}
        </button>
      ))}
    </div>
  );
};
