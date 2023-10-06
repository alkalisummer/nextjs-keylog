import React, { useState } from 'react';

const Hashtag = ({ hashtag, setHashtag, hashtagArr, setHashtagArr }: { hashtag: string; setHashtag: React.Dispatch<React.SetStateAction<string>>; hashtagArr: string[]; setHashtagArr: React.Dispatch<React.SetStateAction<string[]>> }) => {
  //이벤트 실행순서 : onKeyDown -> onKeyPress -> onChange -> onKeyUp 이므로 onChange로 먼저 상태변경 후 onKeyUp에서 comma와 enter를 구분자로 split
  const splitTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      //comma 제거, 중복 제거
      const inputText = hashtag.replaceAll(',', '').trim();
      if (inputText.replaceAll(' ', '') && hashtagArr.indexOf(inputText) === -1) {
        setHashtagArr((prev) => [...prev, inputText]);
      }
      setHashtag('');
    }
  };

  return (
    <span className='post_hashtag_input_div'>
      #<input type='text' id='post_hashtag_input' className='post_hashtag_input' value={hashtag} onChange={(e) => setHashtag(e.target.value)} onKeyUp={(e) => splitTag(e)} placeholder='태그를 입력하세요'></input>
    </span>
  );
};

export default Hashtag;
