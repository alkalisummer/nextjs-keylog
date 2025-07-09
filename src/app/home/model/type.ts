import { Trend } from '@/entities/trend/model';
import { Article } from '@/entities/article/model';
import { Post } from '@/entities/post/model';

export interface HomeInitData {
  trends: Trend[];
  initialArticles: Article[];
  initialPosts: Post[];
}
