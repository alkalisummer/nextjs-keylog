import css from './boxSkeleton.module.scss';

interface Props {
  height: number;
  title?: string;
}
export const BoxSkeleton = ({ title, height }: Props) => {
  return (
    <>
      {title && <h2 className={css.title}>{title}</h2>}
      <div className={css.skeleton} style={{ height }}></div>
    </>
  );
};
