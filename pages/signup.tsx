import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDebounce } from '@/hooks/useDebounce';
import signupStyle from '../styles/Signup.module.css';
import { timeToString } from '@/utils/CommonUtils';
import axios from 'axios';

//mui notification
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

const Signup = () => {
  //아이디
  const [id, setId] = useState('');
  const [idValidate, setIdValidate] = useState<boolean>(true);
  //비밀번호
  const [password, setPassword] = useState('');
  const [passwordValidate, setPasswordValidate] = useState<boolean>(true);
  //비밀번호 확인
  const [pwDoubleCheckText, setPwDoubleCheckText] = useState('');
  const [pwDoubleValidate, setPwDoubleValidate] = useState<boolean>(true);
  //이메일
  const [email, setEmail] = useState('');
  const [emailValidate, setEmailValidate] = useState<boolean>(true);

  //이메일 인증코드 ID
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyCodeId, setVerifyCodeId] = useState('');
  const [verifyCodeValidate, setVerifyCodeValidate] = useState<boolean>(true);

  //닉네임
  const [nickname, setNickname] = useState('');
  const [nicknameValidate, setNicknameValidate] = useState<boolean>(true);
  //블로그 이름
  const [blogName, setBlogName] = useState('');
  const [blogNameValidate, setBlogNameValidate] = useState<boolean>(true);

  //notification 팝업
  const [showNoti, setShowNoti] = useState(false);

  const router = useRouter();

  // 타이핑할때마다 아이디 중복검사 무분별한 api 호출을 막기위해 0.5초 딜레이를 두고 딜레이안에 다른 값이 들어오면 딜레이 초기화
  const debouncedSearchTerm = useDebounce(id, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      idCheck(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //email, password 유효성 검사
    if (!(await idCheck(id))) {
      return;
    } else if (!(await emailCheck(email))) {
      return;
    } else if (!passwordCheck(password)) {
      return;
    } else if (!passwordDoubleCheck(pwDoubleCheckText)) {
      return;
    } else if (!blogNameCheck(blogName)) {
      return;
    } else if (!nicknameCheck(nickname)) {
      return;
    } else if (!(await verifyCodeCheck())) {
      return;
    }
    const currentTime = timeToString(new Date());
    const params = { type: 'signup', id: id, email: email, nickname: nickname.replaceAll(' ', '').replaceAll('\\', '\\\\'), password: password, blogName: blogName.replaceAll('\\', '\\\\'), rgsnDttm: currentTime, amntDttm: currentTime };

    await axios.post('/api/HandleUser', { data: params }).then((res) => {
      setShowNoti(true);
    });
  };

  const idCheck = async (id: string) => {
    const idRegEx = /^[a-z0-9]{5,20}$/;
    let isValidate = idRegEx.test(id);
    const params = { type: 'getUser', id: id };

    if (!isValidate) {
      setIdValidate(false);
      document.querySelector('.idErrMsg')!.innerHTML = '<div class="mt5">아이디는 5-20자의 영문 소문자, 숫자만 사용 가능합니다. </div>';
    } else {
      //ID 중복검사
      await axios.post('/api/HandleUser', { data: params }).then((res) => {
        const userCnt = res.data.totalItems;
        if (userCnt > 0) {
          isValidate = false;
          document.querySelector('.idErrMsg')!.innerHTML = '<div class="mt5">이미 가입되어 있는 아이디입니다.</div>';
        } else {
          setIdValidate(true);
          document.querySelector('.idErrMsg')!.innerHTML = '';
        }
      });
    }
    return isValidate;
  };

  const emailCheck = async (email: string) => {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValidate = emailRegEx.test(email);

    if (!isValidate) {
      setEmailValidate(false);
      document.querySelector('.emailErrMsg')!.innerHTML = '<div class="mt5">이메일 형식이 올바르지 않습니다.</div>';
    } else {
      setEmailValidate(true);
      document.querySelector('.emailErrMsg')!.innerHTML = '';
    }

    return isValidate;
  };

  const passwordCheck = (password: string) => {
    //8~16자의 영문 대/소문자, 숫자를 반드시 포함하여 구성(특수문자도 포함가능)
    const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,16}$/;
    const isValidate = passwordRegEx.test(password);

    if (!isValidate) {
      setPasswordValidate(false);
      document.querySelector('.passwordErrMsg')!.innerHTML = '<div class="mt5">비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력하세요.</div>';
    } else {
      setPasswordValidate(true);
      document.querySelector('.passwordErrMsg')!.innerHTML = '';
    }

    return isValidate;
  };

  const passwordDoubleCheck = (passwordText: string) => {
    const isValidate = password === passwordText ? true : false;
    if (!isValidate) {
      setPwDoubleValidate(false);
      document.querySelector('.pwDobleCheckErrMsg')!.innerHTML = '<div class="mt5">비밀번호가 일치하지 않습니다.</div>';
    } else {
      setPwDoubleValidate(true);
      document.querySelector('.pwDobleCheckErrMsg')!.innerHTML = '';
    }
    return isValidate;
  };

  const nicknameCheck = (nickname: string) => {
    const isValidate = nickname.replaceAll(' ', '').length === 0 ? false : true;
    if (!isValidate) {
      setNicknameValidate(false);
      document.querySelector('.nicknameErrMsg')!.innerHTML = '<div class="mt5">닉네임을 입력해주세요.</div>';
    } else {
      setNicknameValidate(true);
      document.querySelector('.nicknameErrMsg')!.innerHTML = '';
    }
    return isValidate;
  };

  const blogNameCheck = (blogName: string) => {
    const isValidate = blogName.replaceAll(' ', '').length === 0 ? false : true;
    if (!isValidate) {
      setBlogNameValidate(false);
      document.querySelector('.blogNameErrMsg')!.innerHTML = '<div class="mt5">블로그 이름을 입력해주세요.</div>';
    } else {
      setBlogNameValidate(true);
      document.querySelector('.blogNameErrMsg')!.innerHTML = '';
    }
    return isValidate;
  };

  const closeNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNoti(false);
    router.replace('/login');
  };

  const sendEmailCode = async () => {
    if (!emailValidate) {
      return;
    }
    const btn = document.getElementById('signup_vrfy_code_btn') as HTMLButtonElement;
    btn.disabled = true;
    const params = { mode: 'sendMailCode', mailAddress: email };
    await axios.post('/api/SendMailHandler', { data: params }).then((res) => {
      setVerifyCodeId(res.data.insertId);
      alert('입력하신 이메일 주소로 인증코드가 발송되었습니다.\n인증코드는 발송시간을 기준으로 24시간동안 유효합니다. ');
      btn.disabled = false;
    });
  };

  const verifyCodeCheck = async () => {
    let isValidate;
    if (verifyCode.replaceAll(' ', '').length === 0) {
      setVerifyCodeValidate(false);
      isValidate = false;
      document.querySelector('.verifyCodeErrMsg')!.innerHTML = '<div class="mt5">인증코드를 입력해주세요.</div>';
      return isValidate;
    } else if (!verifyCodeId) {
      setVerifyCodeValidate(false);
      isValidate = false;
      document.querySelector('.verifyCodeErrMsg')!.innerHTML = '<div class="mt5">이메일 인증을 진행해주세요.</div>';
      return isValidate;
    } else {
      const params = { userInputCode: verifyCode.replaceAll(' ', ''), verifyCodeId: verifyCodeId };
      isValidate = (await axios.post('/api/CheckVerifyCode', { data: params })).data.isValid;
      if (!isValidate) {
        setVerifyCodeValidate(false);
        document.querySelector('.verifyCodeErrMsg')!.innerHTML = '<div class="mt5">인증코드가 일치하지 않습니다.</div>';
      } else {
        setVerifyCodeValidate(true);
        document.querySelector('.verifyCodeErrMsg')!.innerHTML = '';
      }
    }
    return isValidate;
  };

  return (
    <div className={signupStyle.signup_div}>
      <span className={signupStyle.signup_title}>keylog</span>
      <form onSubmit={submitHandler} className={signupStyle.signup_form}>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${idValidate ? '' : signupStyle.validateErr} btlr`}>
            <i className={'fa-solid fa-user'}></i>
          </div>
          <input
            type='text'
            value={id}
            className={`${signupStyle.signup_input_text} ${idValidate ? '' : signupStyle.validateErr} btrr`}
            placeholder='아이디'
            autoComplete='off'
            required
            onChange={(e) => {
              setId(e.target.value);
            }}
          ></input>
        </div>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${passwordValidate ? '' : signupStyle.validateErr}`}>
            <i className='fa-solid fa-lock'></i>
          </div>
          <input
            type='password'
            value={password}
            className={`${signupStyle.signup_input_text} ${passwordValidate ? '' : signupStyle.validateErr}`}
            placeholder='비밀번호'
            required
            autoComplete='off'
            onChange={(e) => {
              setPassword(e.target.value);
              passwordCheck(e.target.value);
            }}
          ></input>
        </div>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${pwDoubleValidate ? '' : signupStyle.validateErr}`}>
            <i className='fa-solid fa-check'></i>
          </div>
          <input
            type='password'
            value={pwDoubleCheckText}
            className={`${signupStyle.signup_input_text} ${pwDoubleValidate ? '' : signupStyle.validateErr}`}
            placeholder='비밀번호 확인'
            required
            autoComplete='off'
            onChange={(e) => {
              setPwDoubleCheckText(e.target.value);
              passwordDoubleCheck(e.target.value);
            }}
          ></input>
        </div>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${emailValidate ? '' : signupStyle.validateErr}`}>
            <i className={'fa-solid fa-envelope'}></i>
          </div>
          <input
            type='text'
            value={email}
            className={`${signupStyle.signup_input_text} ${emailValidate ? '' : signupStyle.validateErr} brn`}
            placeholder='이메일'
            autoComplete='off'
            required
            onChange={(e) => {
              setEmail(e.target.value);
              emailCheck(e.target.value);
            }}
          ></input>
          <div className={`${signupStyle.signup_vrfy_code_btn_div}`}>
            <button id='signup_vrfy_code_btn' className={`${signupStyle.signup_vrfy_code_btn}`} onClick={() => sendEmailCode()}>
              인증코드 요청
            </button>
          </div>
        </div>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${emailValidate ? '' : signupStyle.validateErr}`}>
            <i className='fa-solid fa-user-check'></i>
          </div>
          <input
            type='text'
            value={verifyCode}
            className={`${signupStyle.signup_input_text} ${verifyCodeValidate ? '' : signupStyle.validateErr}`}
            placeholder='인증코드'
            autoComplete='off'
            required
            onChange={(e) => {
              setVerifyCode(e.target.value);
            }}
          ></input>
        </div>
        <div className={`${signupStyle.signup_input_div}`}>
          <div className={`${signupStyle.signup_emoji} ${blogNameValidate ? '' : signupStyle.validateErr}`}>
            <i className='fa-solid fa-star'></i>
          </div>
          <input
            type='text'
            value={blogName}
            className={`${signupStyle.signup_input_text} ${blogNameValidate ? '' : signupStyle.validateErr}`}
            maxLength={30}
            placeholder='블로그 이름'
            required
            autoComplete='off'
            onChange={(e) => {
              setBlogName(e.target.value);
              blogNameCheck(e.target.value);
            }}
          ></input>
        </div>
        <div className={`${signupStyle.signup_input_div} mb10`}>
          <div className={`${signupStyle.signup_emoji} ${nicknameValidate ? '' : signupStyle.validateErr} bb bblr`}>
            <i className='fa-solid fa-address-card'></i>
          </div>
          <input
            type='text'
            value={nickname}
            className={`${signupStyle.signup_input_text} ${nicknameValidate ? '' : signupStyle.validateErr} bb bbrr`}
            maxLength={20}
            placeholder='닉네임'
            required
            autoComplete='off'
            onChange={(e) => {
              setNickname(e.target.value);
              nicknameCheck(e.target.value);
            }}
          ></input>
        </div>
        <div className={`idErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`emailErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`passwordErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`pwDobleCheckErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`nicknameErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`blogNameErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`verifyCodeErrMsg ${signupStyle.validateErrMsg}`}></div>
        <button type='submit' className={signupStyle.signup_btn}>
          가입하기
        </button>
      </form>
      <Snackbar
        open={showNoti}
        message='회원가입이 완료되었습니다.'
        onClose={closeNoti}
        action={
          <React.Fragment>
            <Button color='primary' size='small' onClick={closeNoti}>
              확인
            </Button>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      ></Snackbar>
    </div>
  );
};

export default Signup;
