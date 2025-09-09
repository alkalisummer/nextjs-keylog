import { FindPasswordForm } from '@/features/login/component';

export default function Page() {
  return (
    <main>
      <FindPasswordForm />
    </main>
  );
}

export const generateMetadata = async () => {
  return {
    title: '비밀번호 찾기',
    description: '비밀번호 찾기',
  };
};
