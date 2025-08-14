import { User } from '@/entities/user/model';

export interface UserToken {
  token: string;
  userId: string;
  expireTime: string;
}

export interface AuthUser {
  accessToken: string;
  accessTokenExpireDate: number;
  user: User;
}
