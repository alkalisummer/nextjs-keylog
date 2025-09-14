import css from './article.module.scss';

export const Article = ({ children }: { children: React.ReactNode }) => {
  return (
    <main id="article" className={css.module} data-article-root>
      <article className={css.article}>{children}</article>
    </main>
  );
};
