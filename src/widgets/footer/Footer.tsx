import css from './footer.module.scss';

export const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.footerContent}>
        This app is built with &nbsp;<span className={css.description}>Next.js</span>
      </div>
    </footer>
  );
};
