import { load } from 'cheerio';

export const parseImgfileArr = (htmlCntn: string) => {
  const $ = load(htmlCntn);
  const imgFiles = $('img')
    .map((index: number, el: any) => $(el).attr('alt'))
    .get();
  return imgFiles;
};

export const getImageProxyUrl = (url: string) => {
  return `${process.env.BASE_URL}/api/image-proxy?url=${encodeURIComponent(url)}`;
};
