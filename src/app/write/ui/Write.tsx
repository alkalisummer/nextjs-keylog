'use client';

import css from './write.module.scss';
import { useState, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons';

interface Props {
  editor: ReactNode;
  assistant: ReactNode;
}

export const Write = ({ editor, assistant }: Props) => {
  const [showAssistant, setShowAssistant] = useState(true);

  return (
    <div className={css.module}>
      <div className={css.editorSection}>{editor}</div>
      <div className={css.postAssistantToggle}>
        <button
          className={`${css.postAssistantToggleBtn} ${showAssistant ? css.rotated : ''}`}
          onClick={() => setShowAssistant(!showAssistant)}
        >
          <FontAwesomeIcon icon={faAngleLeft} className={css.toggleIcon} />
        </button>
      </div>
      <div className={css.postAssistantMobileToggle}>
        <button
          className={`${css.postAssistantMobileToggleBtn} ${showAssistant ? css.rotated : ''}`}
          onClick={() => setShowAssistant(!showAssistant)}
        >
          <FontAwesomeIcon icon={faAngleDown} className={css.toggleIcon} />
        </button>
      </div>
      <div className={`${css.postAssistant} ${!showAssistant ? css.isClosed : ''}`}>{assistant}</div>
    </div>
  );
};

export default Write;
