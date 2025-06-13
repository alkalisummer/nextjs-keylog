import { handleMySql } from './HandleUser';
import { NextApiRequest, NextApiResponse } from 'next';
import { timeToString } from '@/utils/CommonUtils';

const CheckVerifyToken = async (request: NextApiRequest, response: NextApiResponse) => {
  const params = request.body.data;
  const token = params.token;
  const password = params.password;

  const isValid = await handleMySql({ type: 'getUserToken', token: token, password: password }).then(async (res) => {
    const currTime = timeToString(new Date()); // 현재시간:YYYYMMDDHHMMSS
    if (res.totalItems > 0 && currTime <= res.items[0].EXPIRE_TIME) {
      const userId = res.items[0].USER_ID;

      // 토큰 삭제
      handleMySql({ type: 'deleteUserToken', token: token, id: userId });

      return await handleMySql({ type: 'updatePassword', id: userId, amntDttm: currTime, password: password }).then((res) => {
        return true;
      });
    } else {
      return false;
    }
  });

  return response.status(200).json({ isValid });
};

export default CheckVerifyToken;
