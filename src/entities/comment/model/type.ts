export interface Comment {
  postId: number;
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

export interface CommentRes {
  totalItems: number;
  items: Comment[];
  commentId?: number;
  refreshList?: Comment[];
}
