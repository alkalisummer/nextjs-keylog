import { formatDate } from '@/shared/lib/util';
import { Comment } from '@/entities/comment/model';

interface CreateTempCommentArgs {
  postId: number;
  content: string;
  authorId?: string;
  authorName?: string;
  authorImage?: string;
  commentOriginId?: number;
}

export const createComment = ({
  postId,
  content,
  authorId = '',
  authorName = '',
  authorImage = '',
  commentOriginId,
}: CreateTempCommentArgs): Comment => {
  const rgsnDttm = formatDate({ date: new Date(), seperator: '', isExtendTime: true });

  return {
    postId,
    commentId: Date.now(),
    commentDepth: commentOriginId ? 2 : 1,
    commentOriginId: commentOriginId || 0,
    commentCntn: content,
    authorId,
    rgsnDttm,
    userNickname: authorName,
    userThmbImgUrl: authorImage,
    replyCnt: 0,
  };
};
