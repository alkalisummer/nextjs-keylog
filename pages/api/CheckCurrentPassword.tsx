import { handleMySql } from './HandleUser';
import { verifyPassword } from '@/utils/Bcypt';
import { NextApiRequest, NextApiResponse } from 'next';

const CheckCurrentPassword = async (request: NextApiRequest, response: NextApiResponse) => {
  const params = request.body.data;
  const inputPw = params.password;

  params.type = 'getCurrentPassword';

  const currPw = await handleMySql(params).then((res) => {
    const hashedPw = res.items[0].USER_PASSWORD;
    return hashedPw;
  });
  const isValid = await verifyPassword(inputPw, currPw);

  return response.status(200).json({ isValid });
};

export default CheckCurrentPassword;
