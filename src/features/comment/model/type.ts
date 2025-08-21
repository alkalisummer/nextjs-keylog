import { Comment } from '@/entities/comment/model';

export interface CreateCommentRequest {
  postId: number;
  content: string;
  commentOriginId?: number;
}

export interface UpdateCommentRequest {
  commentId: number;
  content: string;
}

export interface DeleteCommentRequest {
  commentId: number;
}

export interface CommentMutationResponse {
  ok: boolean;
  status: number;
  data?: {
    commentId: number;
    message?: string;
  };
  error?: string;
}

export interface CommentToggleLabel {
  hasReplies: boolean;
  showReplies: boolean;
  showReplyForm: boolean;
  replyCnt: number;
}

export type CommentReplies = Record<number, Comment[]>;
