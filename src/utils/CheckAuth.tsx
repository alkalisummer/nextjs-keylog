import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CheckAuth = () => {
  //사용자 세션
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  const router = useRouter();
  const { userId } = router.query;

  let isAuthorized = false;

  if (status === 'authenticated' && currentUserId === userId) {
    isAuthorized = true;
  } else {
    isAuthorized = false;
  }

  return isAuthorized;
};

export default CheckAuth;
