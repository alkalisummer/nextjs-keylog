export interface Post {
  pageIndx: number;
  totalItems: number;
  postId: number;
  postTitle: string;
  postContent: string;
  postThumbnailImageUrl: string;
  registerId: string;
  registrationDateTime: string;
  amendmentDateTime: string;
  userNickname: string;
  userThumbnailImageUrl: string;
  commentCount: number;
  likeCount: number;
  hashtagName?: string;
}
