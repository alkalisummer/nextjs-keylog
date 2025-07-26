'use client';

import { FieldError } from '@/shared/ui';
import { useForm } from 'react-hook-form';
import { updatePassword } from '../../api';
import { useRouter } from 'next/navigation';
import css from './updatePasswordForm.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { UpdatePasswordSchema, UpdatePasswordForm as PasswordForm } from '../../model';

interface ResetPasswordFormProps {
  token: string;
  userId: string;
  isValidToken: boolean;
}

export const UpdatePasswordForm = ({ token, userId, isValidToken }: ResetPasswordFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(UpdatePasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: PasswordForm) => {
    const { password } = data;

    if (!isValidToken) {
      alert('토큰 정보가 유효하지 않습니다. 비밀번호 재설정 링크를 다시 발급받아주세요.');
    }

    const result = await updatePassword({ userId, newPassword: password });

    if (!result.ok) {
      alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    }

    alert('비밀번호 변경이 완료되었습니다. 다시 로그인해주세요.');
    router.push('/login');
  };

  return (
    <div className={css.module}>
      <span className={css.title}>keylog</span>
      <span className={css.infoText}>비밀번호 변경</span>
      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <div className={css.inputDiv}>
          <div className={`${css.emoji} ${css.topLeft}`}>
            <FontAwesomeIcon icon={faLock} className={css.icon} />
          </div>
          <input
            type="password"
            {...register('password')}
            className={`${css.inputText} ${css.topRight}`}
            placeholder="비밀번호"
            required
          ></input>
        </div>
        <div className={`${css.inputDiv} ${css.lastInput}`}>
          <div className={`${css.emoji} ${css.bottomLeft}`}>
            <FontAwesomeIcon icon={faCheck} className={css.icon} />
          </div>
          <input
            type="password"
            {...register('passwordCheck')}
            className={`${css.inputText} ${css.bottomRight}`}
            placeholder="비밀번호 확인"
            required
          ></input>
        </div>
        <FieldError errors={[errors.password, errors.passwordCheck]} />
        <button type="submit" className={css.button}>
          확인
        </button>
      </form>
    </div>
  );
};
