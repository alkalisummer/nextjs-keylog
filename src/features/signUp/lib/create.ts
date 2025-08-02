export const createVerifyCode = (codeLength: number) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
  const allCharacters = lowercase + uppercase + numbers + symbols;

  let randomChar = '';

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    randomChar += allCharacters[randomIndex];
  }

  return randomChar;
};

export const createExpireTime = (hours: number = 24) => {
  const expireTime = new Date(Date.now() + 1000 * 60 * 60 * hours);
  return expireTime;
};

export const createMailOptions = ({
  email,
  verifyCode,
  expireTime,
}: {
  email: string;
  verifyCode: string;
  expireTime: string;
}) => {
  return {
    from: 'verify@keylog.io',
    to: email,
    subject: 'Keylog 회원가입 인증번호',
    html: `
       Keylog 회원가입을 위한 인증번호입니다.
        
          아래의 인증번호를 입력하여 인증을 완료해주세요.
        
          인증번호 : ${verifyCode}
        
          인증번호는 ${expireTime}까지 유효합니다.
          `,
  };
};
