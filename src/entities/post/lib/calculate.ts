export const calculateTotalPage = (totalPageNum: number) => {
  const totalPageNumArr = [];
  for (let i = 1; i <= totalPageNum; i++) {
    totalPageNumArr.push(i);
  }

  return totalPageNumArr;
};
