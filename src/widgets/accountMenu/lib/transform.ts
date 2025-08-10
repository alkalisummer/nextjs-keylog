export const parseUserImageFileName = (userImage: string) => {
  const regex = /\/([^\/]+)$/;
  const match = userImage.match(regex);
  let imgName = '';

  if (match) {
    imgName = match[1];
  }
  return imgName;
};
