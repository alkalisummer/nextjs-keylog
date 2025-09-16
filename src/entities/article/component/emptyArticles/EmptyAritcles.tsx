import css from './emptyArticles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';

export const EmptyArticles = () => {
  return (
    <div className={css.module} role="status" aria-live="polite">
      <FontAwesomeIcon icon={faMagnifyingGlassMinus} className={css.icon} aria-hidden />
      <strong className={css.title}>검색된 관련 기사가 없습니다.</strong>
    </div>
  );
};
