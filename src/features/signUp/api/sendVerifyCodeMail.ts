'use server';

import { formatDate } from '@/shared/lib/util';
import { saveVerifyCode } from './saveVerifyCode';
import { VERIFY_CODE } from '@/shared/lib/constants';
import { createTransporter } from '@/shared/lib/util';
import { createVerifyCode, createMailOptions, createExpireTime } from '../lib';

export const sendVerifyCodeMail = async (email: string) => {
  const transporter = await createTransporter();
  const verifyCode = createVerifyCode(VERIFY_CODE.LENGTH);
  const expireTime = createExpireTime(VERIFY_CODE.EXPIRE_TIME);
  const mailOptions = createMailOptions({
    email,
    verifyCode,
    expireTime: formatDate({ date: expireTime, seperator: '.', isExtendTime: true }),
  });

  try {
    const [sendMailRes, saveVerifyCodeRes] = await Promise.all([
      transporter.sendMail(mailOptions),
      saveVerifyCode({ verifyCode, expireTime: formatDate({ date: expireTime, seperator: '', isFullTime: true }) }),
    ]);

    return {
      ok: saveVerifyCodeRes.ok,
      message: '인증 번호를 발송하였습니다. 이메일을 확인해주세요.',
    };
  } catch (error) {
    return {
      ok: false,
      message: '메일 전송 실패',
    };
  }
};
