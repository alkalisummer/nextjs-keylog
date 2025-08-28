import { client } from '@/shared/lib/client';

export interface ImageItem {
  link: string;
  sizeheight: string;
  sizewidth: string;
  thumbnail: string;
  title: string;
}

export const searchImages = async (keyword: string, pageNum: number = 1) => {
  const result = await client.route().post<ImageItem[]>({
    endpoint: '/trend/searchImage',
    options: {
      body: { keyword, pageNum },
    },
  });
  return result.data;
};
