import { NextApiRequest, NextApiResponse } from 'next';
import GoogleTrendsApi from '@alkalisummer/google-trends-js';
import axios from 'axios';
import Crawler from 'crawler';

interface naverArticle {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

interface article {
  title: string;
  content: string;
}

interface articleKey {
  keyNum: number;
  lang: string;
  geo: string;
}

interface imgData {
  link: string;
  sizeheight: string;
  sizewidth: string;
  thumbnail: string;
  title: string;
}

export const getDailyTrends = async (lang: string) => {
  const dailyTrends = await GoogleTrendsApi.dailyTrends({ geo: 'KR', lang });
  return dailyTrends;
};

export const getGoogleArticles = async (articleKeys: articleKey[], articleCount: number) => {
  const articles = await GoogleTrendsApi.trendingArticles({ articleKeys, articleCount });
  return articles;
};

const getArticles = async (keyword: string) => {
  const cheerio = require('cheerio');

  let naverArticles: naverArticle[] = [];
  let articles: article[] = [];

  const searchParams = {
    params: { query: keyword, display: 100, sort: 'sim' },
    headers: {
      'X-Naver-Client-Id': process.env.X_NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.X_NAVER_CLIENT_SECRET,
    },
  };

  const c = new Crawler({
    maxConnections: 10,
    callback: (error: unknown, res: any, done: any) => {
      if (error) {
        console.log(error);
      } else {
        const $ = res.$;
        const sTitle = $('h2.end_tit').text();
        const sContent = $('#articeBody').text();
        if (sTitle && sContent) {
          articles.push({ title: sTitle, content: sContent });
        }
      }
      done();
    },
  });

  //해당 키워드를 포함하고 네이버 뉴스에 제공된 기사만 parsing
  await axios.get('https://openapi.naver.com/v1/search/news.json', searchParams).then(async res => {
    const result = res.data.items;
    let keywordArr = [];
    if (keyword.indexOf(' ') !== -1) {
      let resultArr = [];
      keywordArr = keyword.replaceAll(' ', '').split('');
      resultArr = result.filter(
        (article: naverArticle) =>
          article.link.indexOf('naver') !== -1 && article.originallink.indexOf('nocutnews') === -1,
      );

      for (let article of resultArr) {
        for (let i = 0; i < keywordArr.length; i++) {
          if (article.title.indexOf(keywordArr[i]) === -1) {
            break;
          }
          if (i === keywordArr.length - 1) {
            naverArticles.push(article);
          }
        }
      }
    } else {
      naverArticles = result.filter(
        (article: naverArticle) =>
          article.title.indexOf(keyword) !== -1 &&
          article.link.indexOf('naver') !== -1 &&
          article.originallink.indexOf('nocutnews') === -1,
      );
    }
  });
  for (let article of naverArticles) {
    await axios.get(article.link).then(async res => {
      const $ = cheerio.load(res.data);
      const host = res.request.host;
      const path = res.request.path;
      let title: string = '';
      let content: string = '';

      switch (host) {
        case 'n.news.naver.com':
          title = $('#title_area').text();
          content = $('#dic_area').text();
          break;
        case 'entertain.naver.com':
          const url = 'https://' + host + path;
          await new Promise<void>((resolve, reject) => {
            c.queue(url);
            c.on('drain', () => {
              resolve();
            });
          });
          break;
        case 'sports.news.naver.com':
          title = $('h4.title').text();
          content = $('#newsEndContents').text();
          break;
      }

      if (title && content) {
        articles.push({ title: title, content: content });
      }
    });
    //4개의 기사만 크롤링
    if (articles.length === 4) {
      break;
    }
  }

  return articles;
};

const getImages = async (keyword: string, pageNum: number) => {
  let images: imgData[] = [];
  const searchParams = {
    params: { query: keyword, display: 30, start: pageNum },
    headers: {
      'X-Naver-Client-Id': process.env.X_NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.X_NAVER_CLIENT_SECRET,
    },
  };

  //해당 키워드와 관련된 이미지를 검색
  await axios
    .get('https://openapi.naver.com/v1/search/image', searchParams)
    .then(res => {
      const result = res.data.items;
      images = result.filter((obj: imgData) => obj.link.indexOf('naver') !== -1);
    })
    .catch(error => console.log());
  return images;
};

const getInterestOverTime = async (keyword: string, geo: string) => {
  const interests = await GoogleTrendsApi.interestOverTime({ keyword, geo });
  return interests;
};

export default async function HandleKeyword(request: NextApiRequest, response: NextApiResponse) {
  let res;
  let type;

  if (request.method === 'GET') {
    type = request.query.type;
  } else if (request.method === 'POST') {
    type = request.body.params.type;
  }

  switch (type) {
    case 'dailyTrends':
      const lang = request.query.lang as string;
      res = await getDailyTrends(lang);
      break;
    case 'relatedQueries':
      const searchKeyword = request.query.keyword;
      const suggestRes = await axios.get(
        `https://suggestqueries.google.com/complete/search?client=chrome-omni&q=${searchKeyword}&hl=ko&gl=KR&oe=utf-8`,
      );
      res = suggestRes.data[1];
      break;
    case 'interestOverTime':
      const interestOverTimekeyword = request.body.params.keyword;
      const interestRes = await getInterestOverTime(interestOverTimekeyword, 'KR');
      res = interestRes;
      break;
    case 'articlePrompt':
      const keyword = request.body.params.keyword;
      const articles = await getArticles(keyword);
      res = articles;
      break;
    case 'searchImage':
      const imgKeyword = request.body.params.keyword;
      const pageNum = request.body.params.pageNum;
      const images = await getImages(imgKeyword, pageNum);
      res = images;
      break;
  }

  return response.status(200).json(res);
}
