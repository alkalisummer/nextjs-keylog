import css from './boxError.module.scss';
import { RetryButton } from './RetryButton';

interface Props {
  height: number;
  title?: string;
}
export const BoxError = ({ title, height }: Props) => {
  return (
    <>
      {title && <h2 className={css.title}>{title}</h2>}
      <div className={css.error} style={{ height: `${height}px` }}>
        <h3>오류가 발생했습니다.</h3>
        <p>다시 시도해 주세요.</p>
        <RetryButton />
      </div>
    </>
  );
};
