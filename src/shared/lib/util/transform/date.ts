export const formatDate = ({
  date,
  seperator = '.',
  isExtendTime = false,
  isFullTime = false,
}: {
  date: Date | string;
  seperator: string;
  isExtendTime?: boolean;
  isFullTime?: boolean;
}) => {
  if (typeof date === 'string') {
    return formatStringDate({ date, seperator, isExtendTime, isFullTime });
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const sec = date.getSeconds().toString().padStart(2, '0');
  if (isExtendTime) {
    return `${year}${seperator}${month}${seperator}${day} ${hour}:${min}`;
  }
  if (isFullTime) {
    return `${year}${month}${day}${hour}${min}${sec}`;
  }
  return `${year}${seperator}${month}${seperator}${day}`;
};

const formatStringDate = ({
  date,
  seperator = '.',
  isExtendTime = false,
  isFullTime = false,
}: {
  date: string;
  seperator: string;
  isExtendTime?: boolean;
  isFullTime?: boolean;
}) => {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  const hour = date.slice(8, 10);
  const min = date.slice(10, 12);
  const sec = date.slice(12, 14);

  if (isExtendTime) {
    return `${year}${seperator}${month}${seperator}${day} ${hour}:${min}`;
  }
  if (isFullTime) {
    return `${year}${month}${day}${hour}${min}${sec}`;
  }
  return `${year}${seperator}${month}${seperator}${day}`;
};
