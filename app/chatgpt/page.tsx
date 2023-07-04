'use client';

import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '../../styles/chat.css';

const ChatGpt = () => {
  const [chatContent, setChatContent] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const footer: any = document.getElementsByClassName('right_footer')[0];
    const leftArea: any = document.getElementsByClassName('left_area')[0];
    footer.style.display = 'none';

    leftArea.style.backgroundColor = '#202123';

    return () => {
      footer.style.display = 'flex';
      leftArea.style.backgroundColor = '#009bf2';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userInput.replaceAll(' ', '').length === 0) {
      return;
    }
    setIsLoading(true);
    setUserInput('');

    const tmpChat = chatContent.map((obj) => obj);

    // gpt 응답을 받기전까지 사용자 input disabled
    const userInputEl = document.getElementsByClassName('user_input')[0] as HTMLInputElement;
    userInputEl.disabled = true;

    const userCntnDiv = document.createElement('div');
    userCntnDiv.innerHTML = `<div class='user_cntn_div'>
                               <img class='user_img' src='/icon/user.png' alt='userimg'>
                               <span class = 'user_cntn_text'>${userInput}</span>
                             </div>`;

    document.querySelector('.chat_content_div')?.append(userCntnDiv);

    //주고 받은 대화가 6문장이 넘어갈시 주고받은 직전 질문 제외 최근 6문장만 가져옴
    if (tmpChat.length >= 8) {
      tmpChat.splice(-8, 2);
    }
    //이전 대화를 유지하기 위해 기존 대화에 push
    const userMsg = { role: 'user', content: userInput };
    tmpChat.push(userMsg);

    axios.post('/api/ChatGptHandle', { chatContent: tmpChat }).then((res) => {
      tmpChat.push(res.data.chatGptRes);
      setChatContent(tmpChat);
      const gptCntnDiv = document.createElement('div');
      gptCntnDiv.innerHTML = `<div class='gpt_cntn_div'>
                                <img class='gpt_img' src='/icon/gptIcon.png' alt='gptimg'>
                                <span class = 'gpt_cntn_text'>${res.data.chatGptRes.content}</span>
                              </div>`;
      document.querySelector('.chat_content_div')?.append(gptCntnDiv);
      userInputEl.disabled = false;
      setIsLoading(false);
    });
  };

  const clearChat = () => {
    setChatContent([]);
    document.querySelector('.chat_content_div')!.innerHTML = '';
  };

  return (
    <form
      className='chat_div'
      onSubmit={handleSubmit}>
      <div className='chat_header_div'>
        <span
          className='chat_back_arrow'
          onClick={() => router.push('/')}>
          &lt;
        </span>
        <span className='chat_header_title'>ChatGPT</span>
        <button
          type='button'
          className='char_clear_btn'
          onClick={clearChat}></button>
      </div>
      {isLoading ? <CircularProgress color='primary' /> : <></>}
      <div className='chat_content_div'></div>
      <div className='user_input_div'>
        <input
          type='text'
          className='user_input'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder='Send a message'
        />
        <div className='chat_submit_btn_div'>
          <button
            type='submit'
            className='chat_submit_btn'></button>
        </div>
      </div>
    </form>
  );
};

export default ChatGpt;
