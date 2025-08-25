'use server';

import { Write } from './ui/Write';

export const Page = async () => {
  return (
    <main>
      <Write />
    </main>
  );
};

export default Page;
