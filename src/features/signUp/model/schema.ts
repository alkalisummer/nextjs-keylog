import * as z from 'zod/v4';
import { isDuplicateUserId, isVerifyCode } from '../lib';

export const SignUpSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1, { message: 'ID를 입력해주세요.' })
      .regex(/^[a-z0-9]{5,20}$/, { message: 'ID는 5-20자의 영문 소문자, 숫자만 사용 가능합니다.' })
      .refine(async id => !(await isDuplicateUserId(id)), {
        message: '이미 가입되어 있는 아이디입니다.',
        path: ['id'],
      }),
    password: z
      .string()
      .trim()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\S]{8,16}$/, {
        message: '비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력하세요.',
      }),
    passwordCheck: z.string().trim().min(1, { message: '비밀번호 확인을 입력해주세요.' }),
    email: z.email({ message: '이메일 형식이 올바르지 않습니다.' }),
    verifyCode: z
      .string()
      .trim()
      .min(1, { message: '인증번호를 입력해주세요.' })
      .refine(
        async code => {
          if (code === '') {
            return true;
          }
          return await isVerifyCode(code);
        },
        {
          message: '인증번호가 일치하지 않습니다.',
        },
      ),
    blogName: z.string().trim().min(1, { message: '블로그 이름을 입력해주세요.' }),
    nickname: z.string().trim().min(1, { message: '닉네임을 입력해주세요.' }),
  })
  .refine(data => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

export type SignUpForm = z.infer<typeof SignUpSchema>;
