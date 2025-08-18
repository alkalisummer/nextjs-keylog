'use client';

import { signOut } from 'next-auth/react';
import styles from './withDraw.module.scss';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/logout/api';
import { deleteUser } from '@/features/account/api';
import { useAuthenticated } from '@/shared/lib/util';
import { deletePostByUserId } from '@/features/post/delete/api';

export const WithDraw = () => {
  const router = useRouter();
  const isAuthenticated = useAuthenticated();

  const leave = async () => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해주세요.');
      router.push('/login');
      return;
    }

    const result = confirm('정말로 탈퇴하시겠습니까?');
    if (result) {
      Promise.all([deleteUser(), logout(), signOut({ redirect: true, callbackUrl: window.location.href })]).then(() => {
        alert('탈퇴되었습니다.');
      });
    }
  };

  return (
    <div className={styles.module}>
      <span className={styles.subTitle}>회원 탈퇴</span>
      <div className={styles.subContent}>
        <button className={styles.leaveButton} onClick={leave}>
          회원 탈퇴
        </button>
        <span className={styles.leaveDescription}>※ 탈퇴시 작성하신 포스트가 모두 삭제되어 복구되지 않습니다.</span>
      </div>
    </div>
  );
};
