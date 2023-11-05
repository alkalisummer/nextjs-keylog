import { NextApiRequest, NextApiResponse } from 'next';
import { handleMySql } from './HandleUser';
import { timeToString, timeFormat, generateRandomNum } from '@/utils/CommonUtils';
import nodemailer from 'nodemailer';

interface mailOption {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export default async function SendMailHandler(request: NextApiRequest, response: NextApiResponse) {
  const params = request.body.data;
  const mode = params.mode;
  let mailOptions: mailOption = {
    from: '',
    to: '',
    subject: '',
    text: '',
  };

  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  switch (mode) {
    case 'forgotPassword':
      params.type = 'getUser';
      const user = await handleMySql(params);
      let tmpPassword = '';

      if (user.totalItems > 0) {
        //영문 소문자, 대문자, 숫자, 특수문자를 랜덤하게 섞은 임시비밀번호 10자리 생성
        tmpPassword = generateRandomNum(10);

        mailOptions = {
          from: 'verify@keylog.io',
          to: user.items[0].USER_EMAIL,
          subject: 'Keylog 임시비밀번호 발급',
          text: `Keylog 임시비밀번호는 ${tmpPassword} 입니다. 로그인 후 비밀번호를 반드시 변경해주세요.`,
        };

        try {
          await transporter.sendMail(mailOptions);
          params.password = tmpPassword;
          params.type = 'updatePassword';
          params.amntDttm = timeToString(new Date());
          await handleMySql(params);
        } catch (error) {
          console.log(error);
        }
      }
      response.status(200).json(user);
      break;
    case 'sendMailCode':
      const toMailAddress = params.mailAddress;
      //영문 소문자, 대문자, 숫자, 특수문자를 랜덤하게 섞은 임시비밀번호 10자리 생성
      const verifyCode = generateRandomNum(10);
      const expireTime = new Date(Date.now() + 1000 * 60 * 60 * 24); // 만료시간 24시간
      const expireTimeToStr = timeToString(expireTime);

      mailOptions = {
        from: 'verify@keylog.io',
        to: toMailAddress,
        subject: 'Keylog 회원가입 인증코드',
        text: `
          Keylog 회원가입을 위한 인증코드입니다.
        
          아래의 인증코드를 입력하여 인증을 완료해주세요.
        
          인증코드 : ${verifyCode}
        
          인증코드는 ${timeFormat(expireTimeToStr)}까지 유효합니다.
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        params.verifyCode = verifyCode;
        params.type = 'insertVerifyCode';
        params.expireTime = expireTimeToStr;
        params.rgsnDttm = timeToString(new Date());
        const veryfyCodeId = await handleMySql(params);

        response.status(200).json(veryfyCodeId);
      } catch (error) {
        console.log(error);
      }

      break;
  }
}
