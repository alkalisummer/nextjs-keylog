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

  await connection.connect();

  switch (params.type) {
    case 'getUser':
      const userEmail = params.email;
      sql = `SELECT USER_ID, USER_EMAIL, USER_NICKNAME, USER_PASSWORD, USER_THMB_IMG_URL FROM USER WHERE USER_EMAIL = '${userEmail}'`;
      break;
    case 'signup':
      const email = params.email;
      const nickname = params.nickname;
      const password = await hashPassword(params.password);
      const rgsn_dttm = params.rgsn_dttm;
      const amnt_dttm = params.amnt_dttm;
      sql = `INSERT INTO USER (USER_EMAIL, USER_NICKNAME, USER_PASSWORD, RGSN_DTTM, AMNT_DTTM) VALUES ('${email}', '${nickname}', '${password}', '${rgsn_dttm}', '${amnt_dttm}')`;
      break;
    case 'resetPassword':
      const tmpPassword = await hashPassword(params.tmpPassword);
      const targetMail = params.email;
      const amntDttm = params.amntDttm;
      sql = `UPDATE USER SET USER_PASSWORD = '${tmpPassword}', AMNT_DTTM = '${amntDttm}' WHERE USER_EMAIL = '${targetMail}'`;
      console.log(sql);
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
