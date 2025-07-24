export const validateEmail = (email: string) => {
  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let isValidate = emailRegEx.test(email);
  return isValidate;
};
