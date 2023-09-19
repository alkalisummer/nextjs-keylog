/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import axios from 'axios';

import { onUploadImage, getImgName, timeToString } from '@/utils/CommonUtils';

//로그인시 우측 상단메뉴 토글
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

//계정정보 수정 모달
import Modal from '@mui/material/Modal';

//mui notification
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

const Navbar = () => {
  //사용자 세션
  const { data: session, status, update } = useSession();

  //로그인시 메뉴 토글
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const toggleOpen = Boolean(anchorEl);

  //계정정보 수정 모달
  const [openModal, setOpenModal] = useState(false);

  //닉네임
  const [nickname, setNickname] = useState(session?.user?.name);
  const [showNameInput, setShowNameInput] = useState(false);

  //블로그 이름
  const [blogName, setBlogName] = useState(session?.user?.blogName);

  //이메일
  const [email, setEmail] = useState(session?.user?.email!);
  const [showEmailInput, setShowEmailInput] = useState(false);

  //비밀번호
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [showPwInput, setShowPwInput] = useState(false);

  //notification 팝업
  const [showNoti, setShowNoti] = useState(false);

  const [showCreateBtn, setShowCreateBtn] = useState(true);

  useEffect(() => {
    // 세션이 만료된경우 계정관리창 닫기
    if (status === 'unauthenticated') {
      setOpenModal(false);
    }
    if (window.location.href.indexOf('/posts/create') !== -1) {
      setShowCreateBtn(false);
    } else {
      setShowCreateBtn(true);
    }
  }, [status]);

  const openToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeToggle = () => {
    setAnchorEl(null);
  };

  const uploadImg = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target.files?.[0];
    if (fileInput && status === 'authenticated') {
      //기존 이미지가 있다면 오라클클라우드 버킷에서 삭제
      deleteImg();
      //오라클 클라우드에 이미지 업로드 후 url 반환
      const image = await onUploadImage(fileInput);

      const imgUrl = image.imgUrl;
      const userId = session!.user?.id;

      const params = { type: 'uploadUserImg', imgUrl: imgUrl, id: userId };
      await axios.get('/api/HandleUser', { params: params });
      await update({ type: 'uploadImg', imgUrl });
    }
  };

  const deleteImg = async () => {
    if (status === 'authenticated' && session!.user?.image) {
      const imgUrl = getImgName(session!.user!.image!);
      const userId = session?.user?.id;

      let removedImg = [];
      removedImg.push(imgUrl);

      const params = { type: 'deleteUserImg', id: userId };
      await axios.get('/api/HandleUser', { params: params });
      await axios.post('/api/DeleteImgFile', { removedImg });
      await update({ type: 'deleteImg' });
    }
  };

  const updateNicknameBlogName = async () => {
    if (!nickname) {
      alert('닉네임을 입력하세요.');
      return;
    } else if (!blogName) {
      alert('블로그 이름을 입력하세요.');
      return;
    }

    if (status === 'authenticated') {
      const userId = session?.user?.id;
      const params = { type: 'updateNicknameBlogName', nickname: nickname, blogName: blogName, id: userId };
      await axios.get('/api/HandleUser', { params: params });
      await update({ nickname, blogName });
    }
    setShowNameInput(false);
  };

  const passwordCheck = async () => {
    if (!currPassword) {
      alert('현재 비밀번호를 입력하세요.');
      return false;
    }
    //8~16자의 영문 대/소문자, 숫자를 반드시 포함하여 구성(특수문자도 포함가능)
    const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,16}$/;
    let isValidate = passwordRegEx.test(newPassword);

    if (!isValidate) {
      alert('비밀번호는 8~16자의 영문 대/소문자, 숫자가 포함되어야 합니다.');
      return isValidate;
    }

    //현재 비밀번호 일치유무 확인
    const params = { password: currPassword, id: session?.user?.id };
    await axios.post('/api/CheckCurrentPassword', { data: params }).then((res) => {
      const result = res.data.isValid;
      if (!result) {
        isValidate = false;
        alert('현재 비밀번호가 일치하지 않습니다.');
        return isValidate;
      }
    });
    return isValidate;
  };

  const passwordDoubleCheck = () => {
    const isValidate = newPassword === checkPassword && checkPassword.length > 0 ? true : false;

    if (checkPassword.length === 0) {
      alert('새 비밀번호 확인을 입력하세요');
      return isValidate;
    }

    if (!isValidate) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return isValidate;
    }

    return isValidate;
  };

  const updatePassword = async () => {
    if (!(await passwordCheck())) {
      return;
    } else if (!passwordDoubleCheck()) {
      return;
    }
    const userId = session?.user?.id;
    const amntDttm = timeToString(new Date());
    const params = { type: 'updatePassword', password: newPassword, id: userId, amntDttm: amntDttm };
    axios.post('/api/HandleUser', { data: params }).then((res) => {
      alert('비밀번호가 변경되었습니다.');
      setShowPwInput(false);
    });
  };

  const cancelPwUpdate = () => {
    setShowPwInput(false);
    setCurrPassword('');
    setNewPassword('');
    setCheckPassword('');
  };

  //회원탈퇴
  const dropOut = async () => {
    const userId = session?.user?.id;
    const params = { type: 'dropOut', id: userId };

    await axios.post('/api/HandleUser', { data: params }).then((res) => {
      setOpenModal(false);
      signOut();
    });

    await axios.post('/api/HandlePost', { data: params });
  };

  //mui notification 닫기
  const closeNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNoti(false);
  };

  const updateEmail = async () => {
    const userId = session?.user?.id;
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValidate = emailRegEx.test(email);

    if (!isValidate) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }

    const params = { type: 'updateEmail', id: userId, email: email };
    await axios.post('/api/HandleUser', { data: params }).then(async (res) => {
      await update({ email });
      setShowEmailInput(false);
    });
  };

  return (
    <div className='nav_div'>
      {status === 'authenticated' ? (
        <div className='df'>
          <div className={showCreateBtn ? '' : 'dn'}>
            <Link href={`/${session.user?.id}/posts/create`} className='nav_create_link'>
              <button className='nav_create_btn'>새 글 작성</button>
            </Link>
          </div>
          <div onClick={openToggle} className='nav_menu_div'>
            <img id='nav_menu_img' src={session.user?.image ? session.user?.image : '/icon/person.png'} alt='userImage'></img>
            <div>▾</div>
          </div>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={toggleOpen}
            onClose={closeToggle}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => {
                setOpenModal(true);
                closeToggle();
              }}
            >
              <i className='fa-solid fa-user nav_menu_item_ico'></i>계정관리
            </MenuItem>
            <MenuItem>
              <Link href={`/${session.user?.id}`}>
                <i className='fa-brands fa-kickstarter nav_menu_item_ico'></i>내 키로그
              </Link>
            </MenuItem>
            <MenuItem onClick={() => signOut()}>
              <i className='fa-solid fa-right-from-bracket nav_menu_item_ico'></i>로그아웃
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <div>
          <Link href={'/login'} className='nav_login_btn'>
            로그인
          </Link>
        </div>
      )}
      <Modal open={openModal} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <div className='nav_modal_div'>
          <button
            className='nav_modal_close_btn'
            onClick={() => {
              setOpenModal(false);
              setShowNameInput(false);
              cancelPwUpdate();
            }}
          >
            ✕
          </button>
          <div className='nav_modal_profile'>
            <div className='nav_profile_img_div'>
              <img id='nav_profile_img' src={session?.user?.image ? session.user?.image : '/icon/person.png'} alt='userImage'></img>
              <label htmlFor='fileInput' className='nav_img_upload_btn'>
                이미지 업로드
              </label>
              <input type='file' id='fileInput' accept='image/*' onChange={(e) => uploadImg(e)} className='dn' />
              <button className='nav_img_del_btn' onClick={() => deleteImg()}>
                이미지 삭제
              </button>
            </div>
            <div className='nav_profile_detail_div'>
              <div className='nav_modal_nickname_div'>
                {!showNameInput ? (
                  <div className='df fd_c w100'>
                    <div className='df jc_sb w100 mb5'>
                      <span id='nav_modal_nickname'>{session?.user?.name}</span>
                      <span
                        className='nav_modal_text_update_btn lh25'
                        onClick={() => {
                          setShowNameInput(true);
                          setNickname(session?.user?.name);
                        }}
                      >
                        수정
                      </span>
                    </div>
                    <div>
                      <span className='nav_modal_email'>{session?.user?.blogName}</span>
                    </div>
                  </div>
                ) : (
                  <div className='df fd_c w100'>
                    <input className='nav_modal_input' type='text' placeholder='닉네임' value={nickname ? nickname : ''} onChange={(e) => setNickname(e.target.value)} />
                    <input className='nav_modal_input' type='text' placeholder='블로그 이름' value={blogName} onChange={(e) => setBlogName(e.target.value)} />
                    <div className='df jc_e'>
                      <button className='nav_modal_profile_btn' onClick={() => updateNicknameBlogName()}>
                        저장
                      </button>
                      <button className='nav_modal_profile_btn nav_modal_cancel' onClick={() => setShowNameInput(false)}>
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='nav_modal_sub_div'>
            <span className='nav_modal_sub_title'>이메일</span>

            <div className='nav_modal_sub fd_i jc_sb'>
              {!showEmailInput ? (
                <>
                  <span className='nav_modal_email'>{session?.user?.email}</span>
                  <span
                    className='nav_modal_text_update_btn lh19'
                    onClick={() => {
                      setShowEmailInput(true);
                    }}
                  >
                    수정
                  </span>
                </>
              ) : (
                <>
                  <input type='text' value={email} placeholder='이메일을 입력하세요.' className='nav_modal_input w80 mb0' onChange={(e) => setEmail(e.target.value)} />
                  <button className='nav_modal_profile_btn mb0' onClick={() => updateEmail()}>
                    저장
                  </button>
                </>
              )}
            </div>
          </div>
          <div className='nav_modal_sub_div'>
            <span className='nav_modal_sub_title'>비밀번호</span>
            <div className='nav_modal_sub'>
              {!showPwInput ? (
                <button className='nav_modal_password_btn' onClick={() => setShowPwInput(true)}>
                  비밀번호 변경
                </button>
              ) : (
                <div className='nav_modal_pw_div'>
                  <input type='password' value={currPassword} placeholder='현재 비밀번호' className='nav_modal_pw_input mb15' onChange={(e) => setCurrPassword(e.target.value)} />
                  <input type='password' value={newPassword} placeholder='새 비밀번호' className='nav_modal_pw_input mb5' onChange={(e) => setNewPassword(e.target.value)} />
                  <input type='password' value={checkPassword} placeholder='새 비밀번호 확인' className='nav_modal_pw_input mb5' onChange={(e) => setCheckPassword(e.target.value)} />
                  <button className='nav_modal_password_btn wa mt10' onClick={() => updatePassword()}>
                    확인
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='nav_modal_sub_div bbn'>
            <span className='nav_modal_sub_title mb25'>회원 탈퇴</span>
            <div className='nav_modal_sub'>
              <button className='nav_modal_leave_btn' onClick={() => setShowNoti(true)}>
                회원 탈퇴
              </button>
              <span className='nav_modal_leave_text'>※ 탈퇴시 작성하신 포스트가 모두 삭제되어 복구되지 않습니다.</span>
            </div>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={showNoti}
        message='정말로 탈퇴하시겠습니까?'
        onClose={closeNoti}
        action={
          <React.Fragment>
            <Button color='primary' size='small' onClick={dropOut}>
              확인
            </Button>
            <Button color='inherit' size='small' onClick={closeNoti}>
              취소
            </Button>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      ></Snackbar>
    </div>
  );
};

export default Navbar;
