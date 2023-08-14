import { NextApiRequest, NextApiResponse } from 'next';

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
      const startTm = today.setDate(today.getDate() - 3);

      const interestRes = await googleTrends.interestOverTime({ keyword: keyWordArr, geo: 'KR', hl: 'ko', granularTimeResolution: true, startTime: new Date(startTm) });
      res = interestRes;
      break;
  }

  return response.status(200).json(res);
}
