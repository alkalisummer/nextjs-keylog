/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

//로그인시 우측 상단메뉴 토글
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

//계정정보 수정 모달
import Modal from '@mui/material/Modal';

const Navbar = () => {
  //사용자 세션
  const { data: session, status } = useSession();

  //로그인시 메뉴 토글
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const toggleOpen = Boolean(anchorEl);

  //계정정보 수정 모달
  const [openModal, setOpenModal] = useState(false);

  if (status === 'authenticated') {
    console.log('session', session);
  }

  const openToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeToggle = () => {
    setAnchorEl(null);
  };

  return (
    <div className='nav_div'>
      <span className='nav_logo_btn'>keylog</span>
      {status === 'authenticated' ? (
        <div>
          <div
            onClick={openToggle}
            className='nav_menu_div'>
            <img
              className='nav_menu_img'
              src={session.user?.image ? session.user?.image : '/icon/person.png'}
              alt='userImage'></img>
            <div>▾</div>
          </div>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={toggleOpen}
            onClose={closeToggle}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}>
            <MenuItem onClick={() => setOpenModal(true)}>
              <i className='fa-solid fa-user nav_menu_item_ico'></i>계정관리
            </MenuItem>
            <MenuItem onClick={closeToggle}>
              <i className='fa-solid fa-key nav_menu_item_ico'></i>내 키로그
            </MenuItem>
            <MenuItem onClick={() => signOut()}>
              <i className='fa-solid fa-right-from-bracket nav_menu_item_ico'></i>로그아웃
            </MenuItem>
          </Menu>
          <Modal
            open={openModal}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'>
            <div className='nav_modal_div'>
              <div className='nav_modal_profile'>
                <div className='nav_profile_img_div'>
                  <img
                    className='nav_profile_img'
                    src={session.user?.image ? session.user?.image : '/icon/person.png'}
                    alt='userImage'></img>
                  <label
                    htmlFor='fileInput'
                    className='nav_img_upload_btn'>
                    이미지 업로드
                  </label>
                  <input
                    type='file'
                    id='fileInput'
                    className='dn'></input>
                  <button className='nav_img_del_btn'>이미지 삭제</button>
                </div>
                <div className='nav_modal_nickname'></div>
              </div>
              <div className='nav_modal_email'></div>
              <div className='nav_modal_password'></div>
              <div className='nav_modal_leave'></div>
            </div>
          </Modal>
        </div>
      ) : (
        <div>
          <Link
            href={'/login'}
            className='nav_login_btn'>
            로그인
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
