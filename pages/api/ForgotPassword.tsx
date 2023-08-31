import { NextApiRequest, NextApiResponse } from 'next';
import { handleMySql } from './HandleUser';
import { timeToString } from '@/utils/CommonUtils';
import { generateTempPassword } from '@/utils/CommonUtils';
import nodemailer from 'nodemailer';

export default async function ForgotPassword(request: NextApiRequest, response: NextApiResponse) {
  const params = request.body.data;
  params.type = 'getUser';

  const user = await handleMySql(params);
  let tmpPassword = '';

  if (user.totalItems > 0) {
    //영문 소문자, 대문자, 숫자, 특수문자를 랜덤하게 섞은 임시비밀번호 10자리 생성
    tmpPassword = generateTempPassword(10);

    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'verify@keylog.io',
      to: params.email,
      subject: 'Keylog 임시비밀번호 발급',
      text: `Keylog 임시비밀번호는 ${tmpPassword} 입니다. 로그인 후 비밀번호를 반드시 변경해주세요.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      params.tmpPassword = tmpPassword;
      params.type = 'resetPassword';
      params.amntDttm = timeToString(new Date());
      await handleMySql(params);
    } catch (error) {
      console.log(error);
    }
  }

  response.status(200).json(user);
}
