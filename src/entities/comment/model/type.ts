export interface CommentListItem {
  commentId: number;
  commentDepth: number;
  commentOriginId: number;
  commentCntn: string;
  authorId: string;
  rgsnDttm: string;
  userNickname: string;
  userThmbImgUrl: string;
  replyCnt: number;
}

export interface RecentComment {
  commentId: number;
  commentCntn: string;
  rgsnDttm: string;
  postId: number;
  authorId: string;
  userNickname: string;
}

export interface CommentResponse {
  totalItems: number;
  items: CommentListItem[];
  commentId?: number;
  refreshList?: CommentListItem[];
}
