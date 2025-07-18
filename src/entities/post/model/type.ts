export interface Post {
  pageIndx: number;
  totalItems: number;
  postId: number;
  postTitle: string;
  postCntn: string;
  postThmbImgUrl: string;
  authorId: string;
  rgsnDttm: string;
  userNickname: string;
  userThmbImgUrl: string;
  commentCnt: number;
  likeCnt: number;
  hashtagName?: string;
}

export interface PostDetail {
  postId: number;
  postTitle: string;
  postHtmlCntn: string;
  authorId: string;
  tempYn: string;
  amntDttm: string;
}

export interface RecentPost {
  postId: number;
  postTitle: string;
  postThmbImgUrl: string;
  rgsnDttm: string;
}

export interface PopularPost {
  postId: number;
  postTitle: string;
  postThmbImgUrl: string;
  rgsnDttm: string;
  likeCnt: number;
}
