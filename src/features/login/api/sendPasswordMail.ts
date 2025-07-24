'use server';

import nodemailer from 'nodemailer';
import { getUser } from '@/entities/user/api';
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
      ? `${process.env.NEXT_PUBLIC_KEYLOG_URL}/resetPassword/${token}`
      : `${process.env.BASE_URL}/resetPassword/${token}`;

  const mailOptions = createMailOptions({ user, expireTimeMin: expireTime, resetPasswordUrl: url });
};
