import React, { useEffect, useState } from 'react';
import BlogLayout from '../../../src/widgets/BlogLayout';
import ChatGptHandle from '@/utils/ChatGptHandle';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/navigation';
//error Page
import Error from '@/pages/_error';

//redux, redux-saga
import wrapper from '@/store/index';
import { fetchBlogUser } from '@/reducer/blogUser';
import { useAppSelector } from '@/hooks/reduxHooks';
import { END } from 'redux-saga';

const ChatGpt = () => {
  const [chatContent, setChatContent] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const router = useRouter();
  const userInfo = useAppSelector(state => state.blogUser.userInfo);

  useEffect(() => {
    if (userInfo.id) {
      const footer: any = document.getElementsByClassName('right_footer')[0];
      const leftArea: any = document.getElementsByClassName('left_area')[0];
      const blogName: any = document.getElementsByClassName('left_area_blog_name')[0];
      const createBtn: any = document.getElementsByClassName('create_btn')[0];
      const chatGptBtn: any = document.getElementsByClassName('chatgpt_btn')[0];
      const rightHeader: any = document.getElementsByClassName('right_header')[0];

      rightHeader.style.display = 'none';
      footer.style.display = 'none';
      leftArea.style.backgroundColor = '#202123';
      blogName.style.color = '#d1d1d1';
      createBtn.style.filter =
        'invert(100%) sepia(100%) saturate(0%) hue-rotate(10deg) brightness(103%) contrast(101%)';
      chatGptBtn.style.filter = 'invert(35%) sepia(1%) saturate(0%) hue-rotate(100deg) brightness(101%) contrast(89%)';

      return () => {
        rightHeader.style.display = 'flex';
        footer.style.display = 'flex';
        leftArea.style.backgroundColor = '#009bf2';
        blogName.style.color = '#5c5c5c';
        createBtn.style.filter = 'unset';
        chatGptBtn.style.filter =
          'invert(50%) sepia(1%) saturate(0%) hue-rotate(100deg) brightness(101%) contrast(89%)';
      };
    }
  }, []);

  if (!userInfo.id) {
    return <Error statusCode={404} />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userInput.replaceAll(' ', '').length === 0) {
      return;
    }
    //setIsLoading(true);
    setUserInput('');

    const tmpChat = chatContent.map(obj => obj);

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

    const gptCntnDiv = document.createElement('div');
    gptCntnDiv.innerHTML = `<div class='gpt_cntn_div'>
    <img class='gpt_img' src='/icon/gptIcon.png' alt='gptimg'>
    <span class = 'gpt_cntn_text'></span>
    </div>`;
    document.querySelector('.chat_content_div')?.append(gptCntnDiv);

    const chatCompletion = await ChatGptHandle('common', tmpChat);
    const gptTextEl = document.querySelectorAll('.gpt_cntn_text');
    const gptTextSpan = document.querySelectorAll('.gpt_cntn_text')[gptTextEl.length - 1];
    let gptMsg = '';

    for await (const chunk of chatCompletion) {
      const chunkText = chunk.choices[0].delta.content;
      if (chunkText) {
        gptMsg += chunkText;
        gptTextSpan!.innerHTML = gptMsg;
      } else {
        tmpChat.push({ role: 'assistant', content: gptMsg });
        setChatContent(tmpChat);
        userInputEl.disabled = false;
      }
    }
  };

  const clearChat = () => {
    setChatContent([]);
    document.querySelector('.chat_content_div')!.innerHTML = '';
  };

  return (
    <BlogLayout>
      <form className="chat_div" onSubmit={handleSubmit}>
        <div className="chat_header_div">
          <span className="chat_back_arrow" onClick={() => router.back()}>
            &lt;
          </span>
          <span className="chat_header_title">ChatGPT</span>
          <button type="button" className="char_clear_btn" onClick={clearChat}></button>
        </div>
        <div className="chat_content_div"></div>
        <div className="user_input_div">
          <input
            type="text"
            className="user_input"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Send a message"
          />
          <div className="chat_submit_btn_div">
            <button type="submit" className="chat_submit_btn"></button>
          </div>
        </div>
      </form>
    </BlogLayout>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async context => {
  const userId = context.query.userId as string;

  store.dispatch(fetchBlogUser(userId as string));
  //redux-saga를 사용하여 비동기로 가져오는 데이터의 응답결과를 기다려주는 역할
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  return {
    props: {},
  };
});

export default ChatGpt;
