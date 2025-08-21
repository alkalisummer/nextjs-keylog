import { Comment } from '@/entities/comment/model';

export const parseParentComments = (comments: Comment[]) => {
  return comments.filter(comment => comment.commentDepth === 1);
};
