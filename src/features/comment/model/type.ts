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
