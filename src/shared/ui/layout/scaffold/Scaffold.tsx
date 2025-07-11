import { ReactNode } from 'react';
import css from './scaffold.module.scss';

export const Scaffold = ({ children }: { children: ReactNode }) => {
  return <div className={css.module}>{children}</div>;
};
