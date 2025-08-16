'use server';

import { client } from '@/shared/lib/client';

interface UpdatePasswordProps {
  newPassword: string;
}

export const updatePassword = async ({ newPassword }: UpdatePasswordProps) => {
  return await client.user().put({ endpoint: `/update/password`, options: { body: { password: newPassword } } });
};
