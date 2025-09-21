import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { GoogleTrendsTimeOptions } from '@/entities/trend/model';

export const queryKey = () => ({
  trend: () => ({
    all: () => ['trend'],
    trendsList: () => [...queryKey().trend().all(), 'trendList'],
    interestOverTime: ({
      keywords,
      geo,
      hl,
      period,
    }: {
      keywords: string[];
      geo?: string;
      hl?: string;
      period?: GoogleTrendsTimeOptions;
    }) => [...queryKey().trend().all(), 'interestOverTime', keywords, geo, hl, period],
  }),
  article: () => ({
    all: () => ['article'],
    articleList: (keyword: string) => [...queryKey().article().all(), 'articleList', keyword],
  }),
  post: () => ({
    all: () => ['post'],
    postList: ({
      searchWord = '',
      tagId = '',
      authorId = '',
      currPageNum = 1,
      perPage = NUMBER_CONSTANTS.BLOG_POST_PER_PAGE,
      tempYn = 'N',
    }: {
      searchWord?: string;
      tagId?: string;
      authorId?: string;
      currPageNum?: number;
      perPage?: number;
      tempYn?: string;
    }) => [...queryKey().post().all(), 'postList', searchWord, tagId, authorId, currPageNum, perPage, tempYn],
    postSearch: ({
      searchWord = '',
      tagId = '',
      currPageNum,
      perPage = NUMBER_CONSTANTS.BLOG_POST_PER_PAGE,
    }: {
      searchWord?: string;
      tagId?: string;
      currPageNum?: number;
      perPage?: number;
    }) => [...queryKey().post().all(), 'postSearch', searchWord, tagId, currPageNum, perPage],
    postDetail: (postId: number) => [...queryKey().post().all(), 'postDetail', postId],
    recentPost: (userId: string) => [...queryKey().post().all(), 'recentPost', userId],
    popularPost: (userId: string) => [...queryKey().post().all(), 'popularPost', userId],
  }),
  user: () => ({
    all: () => ['user'],
    userInfo: (userId: string) => [...queryKey().user().all(), 'userInfo', userId],
  }),
  comment: () => ({
    all: () => ['comment'],
    commentList: (postId: number) => [...queryKey().comment().all(), 'commentList', postId],
    recentComment: (userId: string) => [...queryKey().comment().all(), 'recentComment', userId],
  }),
  hashtag: () => ({
    all: () => ['hashtag'],
    hashtagList: (userId: string) => [...queryKey().hashtag().all(), 'hashtagList', userId],
    postHashtags: (postId: number) => [...queryKey().hashtag().all(), 'postHashtags', postId],
  }),
  like: () => ({
    all: () => ['like'],
    likeCnt: (postId: number) => [...queryKey().like().all(), 'likeCnt', postId],
  }),
});
