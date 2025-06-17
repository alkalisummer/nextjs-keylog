// 오라클 클라우드 api key
import API_KEY from '@/shared/config/Bucket';

export function timeToString(dateParam: Date) {
  let year: number | string = dateParam.getFullYear();
  let month: number | string = dateParam.getMonth() + 1;
  let date: number | string = dateParam.getDate();
  let hour: number | string = dateParam.getHours();
  let min: number | string = dateParam.getMinutes();
  let sec: number | string = dateParam.getSeconds();

  if (month < 10) {
    month = '0' + month;
  }
  if (date < 10) {
    date = '0' + date;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (sec < 10) {
    sec = '0' + sec;
  }

  const fullTimeFormat = `${year}${month}${date}${hour}${min}${sec}`;
  return fullTimeFormat;
}

export function timeFormat(currTime: string) {
  const year = currTime.slice(0, 4);
  const month = currTime.slice(4, 6);
  const date = currTime.slice(6, 8);
  let fullTimeFormat;
  if (currTime.length > 12) {
    const hour = currTime.slice(8, 10);
    const min = currTime.slice(10, 12);
    fullTimeFormat = `${year}. ${month}. ${date}. ${hour}:${min}`;
  } else {
    fullTimeFormat = `${year}. ${month}. ${date}`;
  }

  return fullTimeFormat;
}

export function formatCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function formatDate(date: Date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  return year + '-' + month + '-' + day;
}

export function removeHtml(str: string) {
  const cheerio = require('cheerio');
  const $ = cheerio.load(str);
  const plainText = $.text();

  return plainText;
}

export function timeAgoFormat(pressDateArr: number[]) {
  if (!Array.isArray(pressDateArr) || pressDateArr.length === 0) return '';
  const pressDate = pressDateArr[0] * 1000; // 초 → 밀리초
  const now = Date.now();
  const diffMs = now - pressDate;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${diffDay}일 전`;
}

export async function onUploadImage(imgFile: any) {
  //반환 이미지 url
  const imgURL = API_KEY.CLOUD_BUCKET_URL;
  const imgName = `IMG${timeToString(new Date())}`;
  const newImgFile = new File([imgFile], imgName, { type: imgFile.type });
  const form = new FormData();

  form.append('file', newImgFile);

  await fetch('/api/UploadImgFile', {
    method: 'POST',
    headers: {
      'Content-Length': newImgFile.size.toString(),
    },
    body: form,
  });

  return { imgName: imgName, imgUrl: `${imgURL}/${newImgFile.name}` };
}

export function generateRandomChar(charLength: number, type: string) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
  let allCharacters = '';

  if (type === 'password') {
    allCharacters = lowercase + uppercase + numbers + symbols;
  } else {
    allCharacters = numbers;
  }
  let randomChar = '';

  for (let i = 0; i < charLength; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    randomChar += allCharacters[randomIndex];
  }

  return randomChar;
}

export function getEmailId(email: string) {
  const regex = /^[^@]+/;
  const match = email.match(regex);
  let userId;

  if (match) {
    userId = match[0];
  } else {
    console.log('이메일 주소 형식이 잘못되었습니다.');
  }
  return userId;
}

export function getImgName(imgUrl: string) {
  const regex = /\/([^\/]+)$/;
  const match = imgUrl.match(regex);
  let imgName;

  if (match) {
    imgName = match[1];
  } else {
    console.log('URL에서 파일 이름을 추출할 수 없습니다.');
  }
  return imgName;
}

export function getValueToNum(value: string) {
  let valueNum: string = value.replaceAll('+', '');
  let resultNum: number = 0;

  if (valueNum.indexOf('만') !== -1) {
    resultNum = parseInt(valueNum.replaceAll('만', '')) * 10000;
  } else if (valueNum.indexOf('천') !== -1) {
    resultNum = parseInt(valueNum.replaceAll('천', '')) * 1000;
  }
  return resultNum;
}

export function storePathValues(url: string) {
  const storage = globalThis?.sessionStorage;
  if (!storage) return;
  const prevPath = storage.getItem('currentPath') ?? '/';
  storage.setItem('prevPath', prevPath);
  storage.setItem('currentPath', url ? url : globalThis.location.pathname);
}

export function formatTraffic(traffic: string) {
  if (traffic.includes('0000')) {
    return traffic.replace('0000', '') + '만';
  }
  if (traffic.includes('000')) {
    return traffic.replace('000', '') + '천';
  }
  return traffic;
}
