import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

function TrendKeyword() {
  let dailyTrend;

  const getDailyTrend = () => axios.get('/api/HandleKeyword');

  const { status, data, error } = useQuery(['dailyTrend'], getDailyTrend);

  if (status === 'success') {
    dailyTrend = JSON.parse(data.data);
  }

  if (status === 'error') {
    console.log(error);
  }

  return <div>TrendKeyword</div>;
}

export default TrendKeyword;
