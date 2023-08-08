import { NextApiRequest, NextApiResponse } from 'next';

export default async function HandleKeyword(request: NextApiRequest, response: NextApiResponse) {
  const googleTrends = require('google-trends-api');
  let res;

  await googleTrends.dailyTrends({ geo: 'KR', hl: 'ko-KR' }, function (err: any, results: any) {
    res = results;
    console.log(res);
  });

  return response.status(200).json(res);
}
