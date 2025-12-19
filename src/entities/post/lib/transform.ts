import { load } from 'cheerio';

export const parseImgfileArr = (htmlCntn: string) => {
  const $ = load(htmlCntn);
  const imgFiles = $('img')
    .map((index: number, el: any) => $(el).attr('alt'))
    .get();
  return imgFiles;
};

export const getImageProxyUrl = (url: string) => {
  const base = (process.env.NEXT_PUBLIC_IMAGE_PROXY_URL ?? '').replace(/\/$/, '');
  return `${base}/api/image-proxy?url=${encodeURIComponent(url)}`;
};
