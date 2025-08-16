'use server';

import { VerifyPassword } from '../model';
import { client } from '@/shared/lib/client';

interface VerifyPasswordProps {
  userPassword: string;
}

export const verifyPassword = async ({ userPassword }: VerifyPasswordProps) => {
  return await client
    .user()
    .post<VerifyPassword>({ endpoint: `/verify/password`, options: { body: { userPassword } } });
};
