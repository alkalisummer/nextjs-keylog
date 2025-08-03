'use server';

import { client } from '@/shared/lib/client';
import { SignUpForm, SignUpSchema } from '../model/schema';

export const signUp = async (data: SignUpForm) => {
  const signUpValidation = await SignUpSchema.safeParseAsync(data);

  if (!signUpValidation.success) {
    // validation 실패시 에러 반환
    const errors: Record<string, string[]> = {};
    signUpValidation.error.issues.forEach(issue => {
      const field = issue.path[0] as string;
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    });

    return {
      ok: false,
      data: errors,
      error: '회원가입에 실패하였습니다. 입력 정보를 다시 확인해주세요.',
    };
  }

  // validation 성공시 백엔드 API 호출
  return await client.user().post({
    endpoint: '/signup',
    options: {
      body: {
        userId: signUpValidation.data.id,
        userEmail: signUpValidation.data.email,
        userNickname: signUpValidation.data.nickname,
        userPassword: signUpValidation.data.password,
        userBlogName: signUpValidation.data.blogName,
      },
    },
  });
};
