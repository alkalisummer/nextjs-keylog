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
  rgsnDttm: string;
}

export interface RecentPost {
  postId: number;
  postTitle: string;
  postThmbImgUrl: string;
  rgsnDttm: string;
}

export interface PopularPost extends RecentPost {
  likeCnt: number;
}

export type TempYn = 'Y' | 'N';

export interface CreatePostInput {
  postTitle: string;
  postCntn?: string;
  postHtmlCntn?: string;
  postThmbImgUrl?: string;
  tempYn: TempYn;
  postOriginId?: number;
  authorId: string;
  hashtagList?: string[];
}

export interface UpdatePostInput extends CreatePostInput {
  postId: number;
}

export interface PostResponse {
  postId: number;
  authorId: string;
}
