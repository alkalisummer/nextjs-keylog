'use server';

import { getUser } from '@/entities/user/api';
import { saveUserToken } from './saveUserToken';
import { createTransporter } from '@/shared/lib/util';
import { createToken, createMailOptions } from '../lib';

interface SendPasswordMailProps {
  id: string;
  email: string;
}

export const sendPasswordMail = async ({ id, email }: SendPasswordMailProps) => {
  const userRes = await getUser(id);

  if (!userRes.ok) {
    return {
      ok: false,
      message: '사용자 정보를 찾을 수 없습니다.',
    };
  }

  const user = userRes.data;
  const { token, expireTime } = createToken({ length: 20, expireTimeMin: 30 });
  const url =
    process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_KEYLOG_URL}/updatePassword/${token}`
      : `${process.env.BASE_URL}/updatePassword/${token}`;

  const transporter = await createTransporter();
  const mailOptions = createMailOptions({ user, expireTimeMin: expireTime, resetPasswordUrl: url });

  try {
    const [sendMailRes, saveTokenRes] = await Promise.all([
      transporter.sendMail(mailOptions),
      saveUserToken({ token, userId: id, expireTime }),
    ]);

    return {
      ok: saveTokenRes.ok,
      message: '메일 전송 완료',
    };
  } catch (error) {
    return {
      ok: false,
      message: '메일 전송 실패',
    };
  }
};
