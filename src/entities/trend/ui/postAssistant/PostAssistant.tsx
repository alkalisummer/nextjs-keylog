'use client';

import { useState } from 'react';
import { Trend } from '../../model';
import css from './postAssistant.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PostTrendKeyword } from '../postTrendKeyword/PostTrendKeyword';
import { PostRelatedKeywords } from '../postRelatedKeywords/PostRelatedKeywords';
import { PostInterestChart } from '../postInterestChart/PostInterestChart';
import { PostArticles } from '../postArticles/PostArticles';
import { PostAutoPosting } from '../postAutoPosting/PostAutoPosting';
import { PostImageSearch } from '../postImageSearch/PostImageSearch';
import { faChevronDown, faChevronUp, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

interface PostAssistantProps {
  trends: Trend[];
}

export const PostAssistant = ({ trends }: PostAssistantProps) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(trends[0] || null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [openSections, setOpenSections] = useState({
    related: true,
    chart: true,
    articles: true,
    auto: true,
    image: true,
  });

  const toggle = (key: keyof typeof openSections) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const handleTrendSelect = (trend: Trend) => {
    setSelectedTrend(trend);
  };

  return (
    <div className={css.module}>
      <div className={css.header}>
        <div className={css.title}>
          <h3 className={css.title}>급상승 키워드</h3>
          <FontAwesomeIcon icon={faArrowTrendUp} className={css.icon} />
        </div>
        <button className={css.toggleBtn} onClick={() => setIsExpanded(!isExpanded)}>
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
        </button>
      </div>

      {isExpanded && (
        <>
          <PostTrendKeyword trends={trends} selectedKeyword={selectedTrend?.keyword} onSelect={handleTrendSelect} />

          {/* Related Keywords */}
          {/* <section className={css.section}>
            <div className={css.sectionHeader}>
              <h4>연관 검색어</h4>
              <button className={css.toggleBtn} onClick={() => toggle('related')}>
                <FontAwesomeIcon icon={openSections.related ? faChevronUp : faChevronDown} />
              </button>
            </div>
            {openSections.related && <PostRelatedKeywords keyword={selectedTrend?.keyword} />}
          </section> */}

          {/* Articles */}
          {/* <section className={css.section}>
            <div className={css.sectionHeader}>
              <h4>Articles</h4>
              <button className={css.toggleBtn} onClick={() => toggle('articles')}>
                <FontAwesomeIcon icon={openSections.articles ? faChevronUp : faChevronDown} />
              </button>
            </div>
            {openSections.articles && <PostArticles trend={selectedTrend} />}
          </section> */}

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
        </>
      )}
    </div>
  );
};
