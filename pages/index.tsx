import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import axios from 'axios';
import DailyTrends from '@/utils/DailyTrends';

interface keyword {
  name: string;
  value: number;
  articles: [];
}

const HomePage = () => {
  const [keyArr, setKeyArr] = useState<keyword[]>([]);
  const [trendKeyData, setTrendKeyData] = useState<any[]>([]);
  const [baseDate, setBaseDate] = useState<string>('');

  useEffect(() => {
    getDailyTrends();
  }, []);

  const getDailyTrends = async () => {
    await DailyTrends().then((res) => {
      //인기순으로 내림차순
      const sortByValue = res.keyArr.sort((a, b) => b.value - a.value);
      setKeyArr(sortByValue);
      setTrendKeyData(res.trendKeyData);
      setBaseDate(res.baseDate);
    });
  };

  return (
    <div className='index_div'>
      <div className='index_header_div'>
        <span className='nav_logo_btn'>keylog</span>
        <Navbar></Navbar>
      </div>
      <div className='index_main_div'>
        <span className='index_main_title' onClick={() => getDailyTrends()}>{`#keyword`}</span>
        <div className='index_main_keyword_div'>
          {keyArr.map((keyword, idx) => (
            <span key={idx} className='index_main_keyword'>{`#${keyword.name}`}</span>
          ))}
        </div>
        <div className='index_article'></div>
      </div>
    </div>
  );
};

export default HomePage;
