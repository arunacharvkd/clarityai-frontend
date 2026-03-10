import React, { useState } from 'react';

interface Props {
  icon: string;
  title: string;
  tag: string;
  tagClass: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const RequirementSection: React.FC<Props> = ({ icon, title, tag, tagClass, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="req-section">
      <div className="section-header" onClick={() => setOpen(o => !o)}>
        <div className="section-header-left">
          <span className="section-icon">{icon}</span>
          <span className="section-title">{title}</span>
          <span className={`section-tag ${tagClass}`}>{tag}</span>
        </div>
        <span className={`section-chevron ${open ? 'open' : ''}`}>▼</span>
      </div>
      <div className={`section-body ${open ? 'open' : ''}`}>{children}</div>
    </div>
  );
};
