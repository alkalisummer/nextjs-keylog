'use server';

import { client } from '@/shared/lib/client';

export const deleteUser = async () => {
  return await client.user().delete({ endpoint: '/delete' });
};
