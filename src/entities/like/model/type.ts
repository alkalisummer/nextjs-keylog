export interface Like {
  userId: string;
  likeCnt: number;
}

export interface LikeRes {
  totalItems: number;
  items: Like[];
  likeactId?: number;
  refreshCnt?: Like[];
}
