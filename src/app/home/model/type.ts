import { Trend } from '@/entities/trends/model';
import { Article } from '@/entities/articles/model';
import { Post } from '@/entities/posts/model';

export interface HomeInitData {
  trends: Trend[];
  initialArticles: Article[];
  initialPosts: Post[];
}
