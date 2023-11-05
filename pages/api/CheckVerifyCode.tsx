import { handleMySql } from './HandleUser';
import { NextApiRequest, NextApiResponse } from 'next';
import { timeToString } from '@/utils/CommonUtils';

const CheckVerifyCode = async (request: NextApiRequest, response: NextApiResponse) => {
  const params = request.body.data;
  const verifyCodeId = params.verifyCodeId;
  const userInputCode = params.userInputCode;

  const isValid = await handleMySql({ type: 'getVerifyCode', verifyCodeId: verifyCodeId }).then((res) => {
    const verifyCode = res.items[0].VERIFY_CODE;
    const expireTime = res.items[0].EXPIRATION_TIME;
    const currTime = timeToString(new Date());

    return verifyCode === userInputCode && currTime <= expireTime;
  });

  return response.status(200).json({ isValid });
};

export default CheckVerifyCode;
