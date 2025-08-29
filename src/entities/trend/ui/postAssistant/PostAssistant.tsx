'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trend } from '../../model';
import css from './postAssistant.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PostTrendKeyword } from '../postTrendKeyword/PostTrendKeyword';
import { PostInterestChart } from '../postInterestChart/PostInterestChart';
import { PostArticles } from '../../../article/ui';
import { PostAutoPosting } from '../postAutoPosting/PostAutoPosting';
import { PostImageSearch } from '../postImageSearch/PostImageSearch';
import { faChevronDown, faChevronUp, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { Article } from '@/entities/article/model';
import { useArticlesQuery } from '@/entities/article/query';

interface PostAssistantProps {
  trends: Trend[];
}

export const PostAssistant = ({ trends }: PostAssistantProps) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend>(trends[0]);
  const [keywordExpanded, setKeywordExpanded] = useState(true);
  const [articlesExpanded, setArticlesExpanded] = useState(true);
  const [openSections, setOpenSections] = useState({
    related: true,
    chart: true,
    articles: true,
    auto: true,
    image: true,
  });

  const { data: articles } = useArticlesQuery({
    trends,
    selectedTrend: selectedTrend,
  });

  const handleTrendSelect = (trend: Trend) => {
    setSelectedTrend(trend);
  };

  return (
    <div className={css.module}>
      <section className={css.section}>
        <div className={css.title}>
          <h3 className={css.title}>급상승 키워드</h3>
          <FontAwesomeIcon icon={faArrowTrendUp} className={css.icon} />
        </div>
        <button className={css.toggleBtn} onClick={() => setKeywordExpanded(!keywordExpanded)}>
          <FontAwesomeIcon icon={keywordExpanded ? faChevronUp : faChevronDown} />
        </button>
      </section>
      {keywordExpanded && (
        <PostTrendKeyword trends={trends} selectedKeyword={selectedTrend?.keyword} onSelect={handleTrendSelect} />
      )}
      {/* Articles */}
      <section className={css.section}>
        <div className={css.title}>
          <h3 className={css.title}>뉴스</h3>
          <FontAwesomeIcon icon={faNewspaper} className={css.icon} />
        </div>
        <button className={css.toggleBtn} onClick={() => setArticlesExpanded(!articlesExpanded)}>
          <FontAwesomeIcon icon={articlesExpanded ? faChevronUp : faChevronDown} />
        </button>
      </section>
      {articlesExpanded && <PostArticles trend={selectedTrend} articles={articles || []} />}

      {/* Interest Chart */}
      {/* <section className={css.section}>
            <div className={css.sectionHeader}>
              <h4>Interest Change Chart</h4>
              <button className={css.toggleBtn} onClick={() => toggle('chart')}>
                <FontAwesomeIcon icon={openSections.chart ? faChevronUp : faChevronDown} />
              </button>
            </div>
            {openSections.chart && <PostInterestChart keyword={selectedTrend?.keyword} />}
          </section> */}

      {/* Auto Posting */}
      {/* <section className={css.section}>
            <div className={css.sectionHeader}>
              <h4>Auto Posting</h4>
              <button className={css.toggleBtn} onClick={() => toggle('auto')}>
                <FontAwesomeIcon icon={openSections.auto ? faChevronUp : faChevronDown} />
              </button>
            </div>
            {openSections.auto && <PostAutoPosting defaultKeyword={selectedTrend?.keyword || ''} />}
          </section> */}

      {/* Image Search */}
      {/* <section className={css.section}>
            <div className={css.sectionHeader}>
              <h4>Image</h4>
              <button className={css.toggleBtn} onClick={() => toggle('image')}>
                <FontAwesomeIcon icon={openSections.image ? faChevronUp : faChevronDown} />
              </button>
            </div>
            {openSections.image && <PostImageSearch defaultKeyword={selectedTrend?.keyword || ''} />}
          </section> */}
    </div>
  );
};
