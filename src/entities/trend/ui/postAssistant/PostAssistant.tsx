'use client';

import { useState } from 'react';
import { Trend } from '../../model';
import css from './postAssistant.module.scss';
import { PostTrendKeyword } from '../postTrendKeyword/PostTrendKeyword';
import { PostArticles } from '../../../article/ui';
import { faChartLine, faArrowUpLong } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { useArticlesQuery } from '@/entities/article/query';
import { PostAssistantSection } from '../postAssistantSection/PostAssistantSection';
import { PostInterestChart } from '../postInterestChart/PostInterestChart';

interface PostAssistantProps {
  trends: Trend[];
}

export const PostAssistant = ({ trends }: PostAssistantProps) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend>(trends[0]);
  const [keywordExpanded, setKeywordExpanded] = useState(true);
  const [articlesExpanded, setArticlesExpanded] = useState(true);
  const [chartExpanded, setChartExpanded] = useState(true);
  // Additional sections can be added later if needed

  const { data: articles } = useArticlesQuery({
    trends,
    selectedTrend: selectedTrend,
  });

  const handleTrendSelect = (trend: Trend) => {
    setSelectedTrend(trend);
  };

  return (
    <div className={css.module}>
      <PostAssistantSection
        title="급상승 키워드"
        icon={faArrowUpLong}
        expanded={keywordExpanded}
        onToggle={() => setKeywordExpanded(!keywordExpanded)}
      >
        <PostTrendKeyword trends={trends} selectedKeyword={selectedTrend?.keyword} onSelect={handleTrendSelect} />
      </PostAssistantSection>

      <PostAssistantSection
        title="뉴스"
        icon={faNewspaper}
        expanded={articlesExpanded}
        onToggle={() => setArticlesExpanded(!articlesExpanded)}
      >
        <PostArticles trend={selectedTrend} articles={articles || []} />
      </PostAssistantSection>

      <PostAssistantSection
        title="관심도 차트"
        icon={faChartLine}
        expanded={chartExpanded}
        onToggle={() => setChartExpanded(!chartExpanded)}
      >
        <PostInterestChart keyword={selectedTrend?.keyword} />
      </PostAssistantSection>

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
