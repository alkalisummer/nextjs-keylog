export const formatDate = ({
  date,
  seperator = '.',
  isExtendTime = false,
}: {
  date: Date | string;
  seperator: string;
  isExtendTime?: boolean;
}) => {
  if (typeof date === 'string') {
    return formatStringDate({ date, seperator, isExtendTime });
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  if (isExtendTime) {
    const hour = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${year}${seperator}${month}${seperator}${day}${seperator}${hour}:${min}`;
  }
  return `${year}${seperator}${month}${seperator}${day}`;
};

const formatStringDate = ({
  date,
  seperator = '.',
  isExtendTime = false,
}: {
  date: string;
  seperator: string;
  isExtendTime?: boolean;
}) => {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  let fullTimeFormat;
  if (isExtendTime) {
    const hour = date.slice(8, 10);
    const min = date.slice(10, 12);
    fullTimeFormat = `${year}${seperator}${month}${seperator}${day}${seperator}${hour}:${min}`;
  } else {
    fullTimeFormat = `${year}${seperator}${month}${seperator}${day}`;
  }
  return fullTimeFormat;
};
