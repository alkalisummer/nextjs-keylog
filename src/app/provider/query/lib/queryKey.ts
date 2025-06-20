export const queryKey = () => ({
  trend: () => ({
    all: () => ['trend'],
    trendsList: () => [...queryKey().trend().all(), 'trendList'],
  }),
  article: () => ({
    all: () => ['article'],
    articleList: (keyword: string) => [...queryKey().article().all(), 'articleList', keyword],
  }),
});
