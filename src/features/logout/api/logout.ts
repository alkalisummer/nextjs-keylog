'use server';

import { client } from '@/shared/lib/client';

export const logout = async () => {
  await client.user().post({ endpoint: `/logout` });
};
