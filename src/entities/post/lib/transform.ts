import { load } from 'cheerio';

export const parseImgfileArr = (htmlCntn: string) => {
  const $ = load(htmlCntn);
  const imgFiles = $('img')
    .map((index: number, el: any) => $(el).attr('alt'))
    .get();
  return imgFiles;
};
