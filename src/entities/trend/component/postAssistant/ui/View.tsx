'use client';

import { useState } from 'react';
import css from './view.module.scss';
import { Trend } from '../../../model';
import { PostArticles } from '../../../../article/component';
import { faOpenai } from '@fortawesome/free-brands-svg-icons';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { PostAutoPosting } from '../../postAutoPosting/PostAutoPosting';
import { faChartLine, faArrowUpLong, faImage } from '@fortawesome/free-solid-svg-icons';
import { PostImageSearch, PostAssistantSection, PostInterestChart, PostTrendKeyword } from '../..';

interface Props {
  trends: Trend[];
  baseDate: string;
}

export const View = ({ trends, baseDate }: Props) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend>(trends[0]);
  const [keywordExpanded, setKeywordExpanded] = useState(true);
  const [articlesExpanded, setArticlesExpanded] = useState(false);
  const [chartExpanded, setChartExpanded] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [autoPostExpanded, setAutoPostExpanded] = useState(false);

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
        height={618}
      >
        <PostTrendKeyword trends={trends} baseDate={baseDate} setSelectTrend={handleTrendSelect} />
      </PostAssistantSection>
      <PostAssistantSection
        title="관심도 차트"
        icon={faChartLine}
        expanded={chartExpanded}
        onToggle={() => setChartExpanded(!chartExpanded)}
        height={400}
      >
        <PostInterestChart keyword={selectedTrend.keyword} />
      </PostAssistantSection>
      <PostAssistantSection
        title="뉴스"
        icon={faNewspaper}
        expanded={articlesExpanded}
        onToggle={() => setArticlesExpanded(!articlesExpanded)}
        height={360}
      >
        <PostArticles trend={selectedTrend} />
      </PostAssistantSection>
      <PostAssistantSection
        title="이미지 검색"
        icon={faImage}
        expanded={imageExpanded}
        onToggle={() => setImageExpanded(!imageExpanded)}
        height={480}
      >
        <PostImageSearch keyword={selectedTrend.keyword} />
      </PostAssistantSection>
      <PostAssistantSection
        title="AI 포스팅"
        icon={faOpenai}
        expanded={autoPostExpanded}
        onToggle={() => setAutoPostExpanded(!autoPostExpanded)}
        height={440}
      >
        <PostAutoPosting selectedKeyword={selectedTrend.keyword} />
      </PostAssistantSection>
    </div>
  );
};
