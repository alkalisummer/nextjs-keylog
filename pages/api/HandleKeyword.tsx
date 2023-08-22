import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

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

const getArticles = async (keyword: string) => {
  const Crawler = require('crawler');
  const cheerio = require('cheerio');

  let naverArticles: naverArticle[] = [];
  let articles: article[] = [];

  const searchParams = {
    params: { query: keyword, display: 100 },
    headers: {
      'X-Naver-Client-Id': process.env.X_NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.X_NAVER_CLIENT_SECRET,
    },
  };

  const c = new Crawler({
    maxConnections: 10,
    callback: (error: Error, res: any, done: any) => {
      if (error) {
        console.log(error);
      } else {
        const $ = res.$;
        const sTitle = $('h2.end_tit').text();
        const sContent = $('#articeBody').text();
        console.log(sTitle);
        console.log(sContent);
        if (sTitle && sContent) {
          articles.push({ title: sTitle, content: sContent });
        }
      }
      done();
    },
  });

  //해당 키워드를 포함하고 네이버 뉴스에 제공된 기사만 parsing
  await axios.get('https://openapi.naver.com/v1/search/news.json', searchParams).then(async (res) => {
    const result = res.data.items;
    let keywordArr = [];
    if (keyword.indexOf(' ') !== -1) {
      let resultArr = [];

      keywordArr = keyword.replaceAll(' ', '').split('');
      resultArr = result.filter((article: naverArticle) => article.link.indexOf('naver.com') !== -1 && article.originallink.indexOf('nocutnews') === -1);

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
      naverArticles = result.filter((article: naverArticle) => article.title.indexOf(keyword) !== -1 && article.link.indexOf('naver.com') !== -1 && article.originallink.indexOf('nocutnews') === -1);
    }
  });

  for (let article of naverArticles) {
    await axios.get(article.link).then(async (res) => {
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
            console.log(article.link);
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
    //2개의 기사만 크롤링
    if (articles.length === 3) {
      break;
    }
  }

  return articles;
};

export default async function HandleKeyword(request: NextApiRequest, response: NextApiResponse) {
  const googleTrends = require('google-trends-api');

  let res;
  let type = '';

  if (request.method === 'GET') {
    type = request.query.type as string;
  } else if (request.method === 'POST') {
    type = request.body.params.type;
  }

  switch (type) {
    case 'dailyTrends':
      res = await googleTrends.dailyTrends({ geo: 'KR' });
      break;
    case 'relatedQueries':
      const googleSuggests = require('get-google-suggestions');
      const searchKeyword = request.query.keyword;
      const suggestRes = await googleSuggests(searchKeyword);
      res = suggestRes;
      break;
    case 'interestOverTime':
      const keyWordArr = request.body.params.keyword;
      const today = new Date();
      const startTm = new Date(today.setDate(today.getDate() - 3));
      const interestRes = await googleTrends.interestOverTime({ keyword: keyWordArr, geo: 'KR', hl: 'ko', granularTimeResolution: true, startTime: startTm });
      res = interestRes;
      break;
    case 'articlePrompt':
      const keyword = request.body.params.keyword;
      const articles = await getArticles(keyword);
      res = articles;
      break;
  }

  return response.status(200).json(res);
}
