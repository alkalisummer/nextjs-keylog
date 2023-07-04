// 오라클 클라우드 api key
import API_KEY from '@/app/config';

export default function timeToString(dateParam: Date) {
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
  const hour = currTime.slice(8, 10);
  const min = currTime.slice(10, 12);

  const fullTimeFormat = `${year}. ${month}. ${date}. ${hour}:${min}`;

  return fullTimeFormat;
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
