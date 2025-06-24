'use client';

import { FallingText } from '@/shared/ui';
import css from './keywordBox.module.scss';
import { stringifyKeywords } from '../../lib';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { Trend } from '../../model';

interface KeywordBoxProps {
  trends: Trend[];
}

export const KeywordBox = ({ trends }: KeywordBoxProps) => {
  const words = stringifyKeywords(trends);
  return (
    <div className={css.module}>
      <div id="fallingText" className={css.fallingText}>
        <span className={css.title}>Today's Trend</span>
        <FallingText
          text={words}
          randomColor={true}
          trigger="auto"
          backgroundColor="transparent"
          gravity={NUMBER_CONSTANTS.FALLING_TEXT_GRAVITY}
          mouseConstraintStiffness={NUMBER_CONSTANTS.FALLING_TEXT_MOUSE_CONSTRAINT_STIFFNESS}
        />
      </div>
    </div>
  );
};
