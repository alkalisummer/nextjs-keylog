import * as z from 'zod/v4';
import { verifyPassword } from '../api';

export const ImageFormSchema = z.object({
  image: z.instanceof(File).refine(
    file => {
      return file.size < 20 * 1024 * 1024;
    },
    {
      message: '이미지 파일 크기는 20MB 이하여야 합니다.',
    },
  ),
});

export type ImageForm = z.infer<typeof ImageFormSchema>;

export const ProfileFormSchema = z.object({
  nickname: z.string().trim().min(1, { message: '∙ 닉네임을 입력해주세요.' }),
  blogName: z.string().trim().min(1, { message: '∙ 블로그 이름을 입력해주세요.' }),
});

export type ProfileForm = z.infer<typeof ProfileFormSchema>;

export const EmailFormSchema = z.object({
  email: z.email({ message: '∙ 이메일 형식이 올바르지 않습니다.' }),
});

export type EmailForm = z.infer<typeof EmailFormSchema>;

export const CheckPasswordFormSchema = z
  .object({
    currPassword: z
      .string()
      .trim()
      .min(1, { message: '∙ 현재 비밀번호를 입력해주세요.' })
      .refine(
        async currPassword => {
          const result = await verifyPassword({ userPassword: currPassword });
          return result.ok && result.data.isValid;
        },
        {
          message: '∙ 현재 비밀번호가 일치하지 않습니다.',
        },
      ),
    newPassword: z
      .string()
      .trim()
      .min(1, { message: '∙ 새 비밀번호를 입력해주세요.' })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\S]{8,16}$/, {
        message: '∙ 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력하세요.',
      }),
    checkPassword: z.string().trim().min(1, { message: '∙ 새 비밀번호 확인을 입력해주세요.' }),
  })
  .refine(
    data => {
      return data.newPassword === data.checkPassword;
    },
    {
      message: '∙ 새 비밀번호가 일치하지 않습니다.',
      path: ['checkPassword'],
    },
  );

export type CheckPasswordForm = z.infer<typeof CheckPasswordFormSchema>;
