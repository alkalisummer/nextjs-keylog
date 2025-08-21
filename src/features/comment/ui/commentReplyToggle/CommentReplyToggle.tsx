'use client';

import css from './commentReplyToggle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faSquareMinus } from '@fortawesome/free-regular-svg-icons';

type ReplyToggleProps = {
  isMinus: boolean;
  label: string;
  onToggle: () => void;
};

export function CommentReplyToggle({ isMinus, label, onToggle }: ReplyToggleProps) {
  return (
    <span className={css.module} onClick={onToggle}>
      <FontAwesomeIcon icon={isMinus ? faSquareMinus : faSquarePlus} className={css.replyToggleIcon} />
      {label}
    </span>
  );
}
