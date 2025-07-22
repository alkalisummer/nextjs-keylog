export const queryKey = () => ({
  trend: () => ({
    all: () => ['trend'],
    trendsList: () => [...queryKey().trend().all(), 'trendList'],
  }),
  article: () => ({
    all: () => ['article'],
    articleList: (keyword: string) => [...queryKey().article().all(), 'articleList', keyword],
  }),
  post: () => ({
    all: () => ['post'],
    postList: ({
      searchWord,
      tagId,
      authorId,
      currPageNum,
      perPage,
      tempYn,
    }: {
      searchWord?: string;
      tagId?: string;
      authorId?: string;
      currPageNum?: number;
      perPage?: number;
      tempYn?: string;
    }) => [
      ...queryKey().post().all(),
      'postList',
      searchWord ?? '',
      tagId ?? '',
      authorId ?? '',
      currPageNum ?? 1,
      perPage ?? 10,
      tempYn ?? '',
    ],
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
