import { formatDate } from '@/shared/lib/util';

export const validateEmail = (email: string) => {
  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidate = emailRegEx.test(email);
  return isValidate;
};

export const validateToken = (expireTime: string) => {
  const currentTime = formatDate({ date: new Date(), isFullTime: true, seperator: '' });
  let isValid = true;

  if (currentTime > expireTime) {
    isValid = false;
  }

  return isValid;
};
