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
    postList: (
      searchWord?: string,
      tagId?: string,
      authorId?: string,
      currPageNum?: number,
      perPage?: number,
      tempYn?: string,
    ) => [
      ...queryKey().post().all(),
      'postList',
      searchWord ?? '',
      tagId ?? '',
      authorId ?? '',
      currPageNum ?? 1,
      perPage ?? 10,
      tempYn ?? '',
    ],
    postDetail: (postId: string) => [...queryKey().post().all(), 'postDetail', postId],
  }),
});
