import { ReactNode } from 'react';
import css from './responsiveFrame.module.scss';

export const ResponsiveFrame = ({ children }: { children: ReactNode }) => {
  return <div className={css.module}>{children}</div>;
};
