export const decodeUrl = (value: string) => {
  const decoded = decodeURIComponent(value);
  return decoded;
};
