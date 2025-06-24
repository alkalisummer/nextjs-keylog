import { Trend } from '../../model';
import { InfiniteScroll } from '@/shared/ui';
import css from './keywordScroll.module.scss';
import { parseKeywordsArray } from '../../lib/transform';

export const KeywordScroll = ({ trends }: { trends: Trend[] }) => {
  const items = parseKeywordsArray(trends);
  return (
    <div className={css.module}>
      <div className={css.keywordScroll}>
        <InfiniteScroll
          items={items}
          autoplay={true}
          autoplayDirection="up"
          autoplaySpeed={1}
          isTilted={true}
          pauseOnHover={true}
          width="33%"
        />
      </div>
    </div>
  );
};
