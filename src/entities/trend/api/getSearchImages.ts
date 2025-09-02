import { ImageItem } from '../model';
import { client } from '@/shared/lib/client';

export interface SearchImageProps {
  keyword: string;
  pageNum: number;
  perPage: number;
}

export const getSearchImages = async ({ keyword, pageNum = 1, perPage = 10 }: SearchImageProps) => {
  return await client.route().post<ImageItem[]>({
    endpoint: '/trend/searchImage',
    options: {
      body: { keyword, pageNum, perPage },
    },
  });
};
