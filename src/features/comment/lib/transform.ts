import { CommentToggleLabel, CommentReplies } from '../model/type';
import { Comment } from '@/entities/comment/model';

export const getCommentToggleLabel = ({ hasReplies, showReplies, showReplyForm, replyCnt }: CommentToggleLabel) => {
  if (hasReplies && showReplies) return '숨기기';
  if (hasReplies) return `${replyCnt}개의 답글`;
  if (showReplyForm) return '숨기기';
  return '답글 달기';
};

export const mappingReplies = (comments: Comment[]) => {
  return comments
    .filter(comment => comment.commentDepth === 2)
    .reduce((acc, reply) => {
      if (!acc[reply.commentOriginId]) {
        acc[reply.commentOriginId] = [];
      }
      acc[reply.commentOriginId].push(reply);
      return acc;
    }, {} as CommentReplies);
};
