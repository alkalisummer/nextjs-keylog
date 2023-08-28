import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '@/utils/Bcypt';

const conn = {
  // mysql 접속 설정
  host: process.env.CLOUD_MYSQL_HOST,
  port: process.env.CLOUD_MYSQL_PORT,
  user: process.env.CLOUD_MYSQL_USER,
  password: process.env.CLOUD_MYSQL_PASSWORD,
  database: process.env.CLOUD_MYSQL_DATABASE_NM,
};

export const handleMySql = async (params: any) => {
  const mysql = require('mysql');
  const connection = mysql.createConnection(conn);

  let post;
  let postId;
  let sql = '';
  let result: { totalItems: number; items: any[]; postId: string } = {
    totalItems: 0,
    items: [],
    postId: '',
  };

  await connection.connect();

  switch (params.type) {
    case 'list':
      const perPage = params.perPage;
      const currPageNum = params.currPageNum;
      const sttRowNum = perPage * (currPageNum - 1) + 1;
      const eddRowNum = perPage * currPageNum;
      sql = `SELECT * FROM (SELECT ROW_NUMBER() OVER(ORDER BY AMNT_DTTM DESC) AS PAGE_INDX, POST_ID, POST_TITLE, POST_CNTN, POST_THMB_IMG_URL, AMNT_DTTM, COUNT(*) OVER() AS TOTAL_ITEMS FROM POST ) AS A WHERE PAGE_INDX >= ${sttRowNum} AND PAGE_INDX <= ${eddRowNum}`;
      break;
    case 'read':
      postId = params.postId;
      sql = `SELECT POST_ID, POST_TITLE, POST_HTML_CNTN, AMNT_DTTM FROM POST WHERE POST_ID = ${postId}`;
      break;
    case 'insert':
      post = params.post;
      sql = `INSERT INTO POST ( POST_TITLE, POST_CNTN, POST_HTML_CNTN, POST_THMB_IMG_URL, RGSN_DTTM, AMNT_DTTM ) VALUES ( '${post.post_title.replaceAll("'", "''")}', '${post.post_cntn.replaceAll("'", "''")}','${post.post_html_cntn.replaceAll("'", "''")}', '${post.post_thmb_img_url}', '${post.rgsn_dttm}', '${post.amnt_dttm}')`;
      break;
    case 'update':
      post = params.post;
      sql = `UPDATE POST SET POST_TITLE = '${post.post_title.replaceAll("'", "''")}', POST_CNTN = '${post.post_cntn.replaceAll("'", "''")}', POST_HTML_CNTN = '${post.post_html_cntn.replaceAll("'", "''")}', POST_THMB_IMG_URL= '${post.post_thmb_img_url}', AMNT_DTTM='${post.amnt_dttm}' WHERE POST_ID='${post.post_id}'`;
      break;
    case 'delete':
      postId = params.postId;
      sql = `DELETE FROM POST WHERE POST_ID = ${postId}`;
      break;
    case 'login':
      const userEmail = params.userEmail;
      sql = `SELECT USER_EMAIL, USER_NICKNAME, USER_PASSWORD, USER_THMB_IMG_URL FROM USER WHERE ${userEmail}`;
      break;
    case 'signup':
      const email = params.email;
      const nickname = params.nickname;
      const password = await hashPassword(params.password);
      const rgsn_dttm = params.rgsn_dttm;
      const amnt_dttm = params.amnt_dttm;
      sql = `INSERT INTO USER (USER_EMAIL, USER_NICKNAME, USER_PASSWORD, RGSN_DTTM, AMNT_DTTM) VALUES ('${email}', '${nickname}', '${password}', '${rgsn_dttm}', '${amnt_dttm}')`;
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
        resolve(result);
      }
    });
  });

  connection.end();
  return result;
};

export default async function HandlePost(request: NextApiRequest, response: NextApiResponse) {
  let params;

  if (request.method === 'GET') {
    params = request.query;
  } else if (request.method === 'POST') {
    params = request.body.data;
  }
  const result = await handleMySql(params);

  response.status(200).json(result);
}
