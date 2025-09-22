'use client';

import React from 'react';
import { AsyncBoundary } from '@/shared/boundary';
import { BoxSkeleton, BoxError } from '@/shared/ui';
import css from './postAssistantSection.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface PostAssistantSection {
  title: string;
  icon: IconProp;
  height: number;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const PostAssistantSection = ({ title, icon, expanded, onToggle, children, height }: PostAssistantSection) => {
  return (
    <div className={css.module}>
      <section className={css.section}>
        <div className={css.sectionHeader} onClick={onToggle}>
          <div className={css.title}>
            <FontAwesomeIcon icon={icon} className={css.icon} />
            <h3 className={css.title}>{title}</h3>
          </div>
          <button className={css.toggleBtn}>
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
          </button>
        </div>
        {expanded && (
          <AsyncBoundary pending={<BoxSkeleton height={height} />} error={<BoxError height={height} />}>
            {children}
          </AsyncBoundary>
        )}
      </section>
    </div>
  );
};
