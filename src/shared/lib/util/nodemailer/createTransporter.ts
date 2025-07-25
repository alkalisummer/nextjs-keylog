'use server';

import nodemailer from 'nodemailer';

export const createTransporter = async () => {
  return nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};
