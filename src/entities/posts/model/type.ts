export interface Post {
  pageIndx: number;
  totalItems: number;
  postId: number;
  postTitle: string;
  postCntn: string;
  postThmbImgUrl: string;
  authorId: string;
  rgsnDttm: Date;
  userNickname: string;
  userThmbImgUrl: string;
  commentCnt: number;
  likeCnt: number;
  hashtagName?: string;
}
