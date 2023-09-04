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

  let sql = '';
  let result: { totalItems: number; items: any[]; userId: string } = {
    totalItems: 0,
    items: [],
    userId: '',
  };

  let userEmail: string;
  let userPassword: string;
  let userNickname: string;
  let userThmbImgUrl: string;
  let rgsnDttm: string;
  let amntDttm: string;

  await connection.connect();

  switch (params.type) {
    case 'getUser':
      userEmail = params.email;
      sql = `SELECT USER_ID, USER_EMAIL, USER_NICKNAME, USER_PASSWORD, USER_THMB_IMG_URL FROM USER WHERE USER_EMAIL = '${userEmail}'`;
      break;
    case 'signup':
      userEmail = params.email;
      userNickname = params.nickname;
      userPassword = await hashPassword(params.password);
      rgsnDttm = params.rgsn_dttm;
      amntDttm = params.amnt_dttm;
      sql = `INSERT INTO USER (USER_EMAIL, USER_NICKNAME, USER_PASSWORD, RGSN_DTTM, AMNT_DTTM) VALUES ('${userEmail}', '${userNickname}', '${userPassword}', '${rgsnDttm}', '${amntDttm}')`;
      break;
    case 'resetPassword':
      userPassword = await hashPassword(params.tmpPassword);
      userEmail = params.email;
      amntDttm = params.amntDttm;
      sql = `UPDATE USER SET USER_PASSWORD = '${userPassword}', AMNT_DTTM = '${amntDttm}' WHERE USER_EMAIL = '${userEmail}'`;
      break;
    case 'uploadUserImg':
      userThmbImgUrl = params.imgUrl;
      userEmail = params.email;
      sql = `UPDATE USER SET USER_THMB_IMG_URL = '${userThmbImgUrl}' WHERE USER_EMAIL = '${userEmail}'`;
      break;
    case 'deleteUserImg':
      userEmail = params.email;
      sql = `UPDATE USER SET USER_THMB_IMG_URL = '' WHERE USER_EMAIL = '${userEmail}'`;
      break;
  }

  await new Promise((resolve, reject) => {
    connection.query(sql, (error: any, data: any, fields: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        if (!data.length) {
          result.userId = data.insertId;
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

export default async function HandleUser(request: NextApiRequest, response: NextApiResponse) {
  let params;

  if (request.method === 'GET') {
    params = request.query;
  } else if (request.method === 'POST') {
    params = request.body.data;
  }
  const result = await handleMySql(params);

  response.status(200).json(result);
}
