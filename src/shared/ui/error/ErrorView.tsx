'use client';

import Image from 'next/image';
import css from './error.module.scss';
import { useRouter } from 'next/navigation';

interface Props {
  code: 404 | 500;
}

export function ErrorView({ code }: Props) {
  const router = useRouter();
  return (
    <div className={css.module}>
      <span className={css.errorText}>{`Something went wrong!`}</span>
      <span className={css.errorText}>{`Error Code : ${code}`}</span>
      <Image width={330} height={330} className={css.errorImage} src="/icon/errorImg.png" alt="errorImage" priority />
      <button className={css.errorBtn} onClick={() => router.back()}>
        Go Back
      </button>
    </div>
  );
}
