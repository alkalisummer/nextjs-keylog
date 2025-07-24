import crypto from 'crypto';
import { User } from '@/entities/user/model';
import { formatDate } from '@/shared/lib/util/transform/date';

export const createToken = ({ length, expireTimeMin }: { length: number; expireTimeMin: number }) => {
  const token = crypto.randomBytes(length).toString('hex');
  const expireTime = formatDate({ date: new Date(Date.now() + 1000 * 60 * expireTimeMin), seperator: '.' });

  return { token, expireTime };
};

export const createMailOptions = ({
  user,
  expireTimeMin,
  resetPasswordUrl,
}: {
  user: User;
  expireTimeMin: string;
  resetPasswordUrl: string;
}) => {
  return {
    from: 'verify@keylog.io',
    to: user.userEmail,
    subject: 'Keylog 비밀번호 변경 인증 메일',
    html:
      `
          <html>
            <body>
            <div>
              안녕하세요 ${user.userNickname}님<br><br>
    
              계정 비밀번호를 재설정하기 위해 아래의 링크를 클릭하여 주세요.<br><br>
              
              <a href='` +
      resetPasswordUrl +
      `'>비밀번호 재설정</a><br><br>
              
              위 링크는 ${expireTimeMin}까지 유효합니다.
            </div>
            </body>
          </html>
          `,
  };
};
