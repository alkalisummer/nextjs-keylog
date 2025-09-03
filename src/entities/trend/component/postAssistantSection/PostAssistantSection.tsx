'use client';

import React from 'react';
import css from './postAssistantSection.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface PostAssistantSection {
  title: string;
  icon: IconProp;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const PostAssistantSection = ({ title, icon, expanded, onToggle, children }: PostAssistantSection) => {
  return (
    <div className={css.module}>
      <section className={css.section}>
        <div className={css.sectionHeader}>
          <div className={css.title}>
            <FontAwesomeIcon icon={icon} className={css.icon} />
            <h3 className={css.title}>{title}</h3>
          </div>
          <button className={css.toggleBtn} onClick={onToggle}>
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
          </button>
        </div>
        {expanded && children}
      </section>
    </div>
  );
};
