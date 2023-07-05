import { NextApiRequest, NextApiResponse } from 'next';

const conn = {
  // mysql 접속 설정
  host: process.env.CLOUD_MYSQL_HOST,
  port: process.env.CLOUD_MYSQL_PORT,
  user: process.env.CLOUD_MYSQL_USER,
  password: process.env.CLOUD_MYSQL_PASSWORD,
  database: process.env.CLOUD_MYSQL_DATABASE_NM,
};

export default async function HandlePost(request: NextApiRequest, response: NextApiResponse) {
  const mysql = require('mysql');
  const connection = mysql.createConnection(conn);
  let params;
  let sql = '';
  let post;
  let postId;
  let result: { totalItems: number; items: any[]; postId: string } = {
    totalItems: 0,
    items: [],
    postId: '',
  };
  if (request.method === 'GET') {
    params = request.query;
  } else if (request.method === 'POST') {
    params = request.body.postData;
  }

  await connection.connect();

  switch (params.type) {
    case 'list':
      const perPage = params.perPage;
      const currPageNum = params.currPageNum;
      const sttRowNum = perPage * (currPageNum - 1) + 1;
      const eddRowNum = perPage * currPageNum;
      sql = `SELECT * FROM (SELECT ROW_NUMBER() OVER(ORDER BY AMNT_DTTM DESC) AS PAGE_INDX, POST_ID, POST_TITLE, POST_CNTN, POST_HTML_CNTN, AMNT_DTTM, COUNT(*) OVER() AS TOTAL_ITEMS FROM POST ) AS A WHERE PAGE_INDX >= ${sttRowNum} AND PAGE_INDX <= ${eddRowNum}`;
      break;
    case 'read':
      postId = params.postId;
      sql = `SELECT * FROM POST WHERE POST_ID = ${postId}`;
      break;
    case 'insert':
      post = params.post;
      sql = `INSERT INTO POST ( POST_TITLE, POST_CNTN, POST_HTML_CNTN, RGSN_DTTM, AMNT_DTTM ) VALUES ( '${post.post_title}', '${post.post_cntn}','${post.post_html_cntn}', '${post.rgsn_dttm}', '${post.amnt_dttm}')`;
      break;
    case 'update':
      post = params.post;
      sql = `UPDATE POST SET POST_TITLE = '${post.post_title}', POST_CNTN = '${post.post_cntn}', POST_HTML_CNTN = '${post.post_html_cntn}', AMNT_DTTM='${post.amnt_dttm}' WHERE POST_ID='${post.post_id}'`;
      break;
    case 'delete':
      postId = params.postId;
      sql = `DELETE FROM POST WHERE POST_ID = ${postId}`;
      break;
  }

  await new Promise((resolve, reject) => {
    connection.query(sql, (error: any, data: any, fields: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        if (!data.length) {
          result.postId = data.insertId;
        } else {
          let rowArr = [];
          for (let row of data) {
            rowArr.push(row);
          }
          result.totalItems = rowArr[0].TOTAL_ITEMS || rowArr.length;
          result.items = rowArr;
        }
        resolve(response.status(200).json(result));
      }
    });
  });

  connection.end();
}
