'use client';

import { useState } from 'react';
import { Trend } from '../../../model';
import css from './view.module.scss';
import { useArticlesQuery } from '@/entities/article/query';
import { PostArticles } from '../../../../article/component';
import { faOpenai } from '@fortawesome/free-brands-svg-icons';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { faChartLine, faArrowUpLong, faImage } from '@fortawesome/free-solid-svg-icons';
import { PostAutoPosting } from '../../postAutoPosting/PostAutoPosting';
import { PostImageSearch, PostAssistantSection, PostInterestChart, PostTrendKeyword } from '../..';

interface Props {
  trends: Trend[];
}

export const View = ({ trends }: Props) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend>(trends[0]);
  const [keywordExpanded, setKeywordExpanded] = useState(true);
  const [articlesExpanded, setArticlesExpanded] = useState(true);
  const [chartExpanded, setChartExpanded] = useState(true);
  const [imageExpanded, setImageExpanded] = useState(true);
  const [autoPostExpanded, setAutoPostExpanded] = useState(true);

  const { data: articles } = useArticlesQuery({
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
        <PostInterestChart keyword={selectedTrend.keyword} />
      </PostAssistantSection>
      <PostAssistantSection
        title="이미지 검색"
        icon={faImage}
        expanded={imageExpanded}
        onToggle={() => setImageExpanded(!imageExpanded)}
      >
        <PostImageSearch keyword={selectedTrend.keyword} />
      </PostAssistantSection>
      <PostAssistantSection
        title="AI 포스팅"
        icon={faOpenai}
        expanded={autoPostExpanded}
        onToggle={() => setAutoPostExpanded(!autoPostExpanded)}
      >
        <PostAutoPosting selectedKeyword={selectedTrend.keyword} />
      </PostAssistantSection>

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
    </div>
  );
};
