import { ReactNode } from 'react';
import css from './home.module.scss';

export const Home = ({ children }: { children: ReactNode }) => {
  return <div className={css.module}>{children}</div>;
};
