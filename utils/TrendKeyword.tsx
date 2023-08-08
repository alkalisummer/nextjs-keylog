import React from 'react';
import axios from 'axios';

function TrendKeyword() {
  axios.get('/api/HandleKeyword').then((res) => {
    const keywordData = JSON.parse(res.data);
    debugger;
    console.log();
  });

  return <div>TrendKeyword</div>;
}

export default TrendKeyword;
