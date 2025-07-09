import css from './article.module.scss';

export const Article = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={css.module}>
      <article className={css.article}>{children}</article>
    </main>
  );
};
