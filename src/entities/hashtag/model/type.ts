export interface HashtagInfo {
  hashtagId: number | null;
  hashtagName: string;
  hashtagCnt: number;
}

export interface PostHashtags {
  postId: number;
  hashtagId: number;
  hashtagName: string;
  rgsnDttm: string;
}
