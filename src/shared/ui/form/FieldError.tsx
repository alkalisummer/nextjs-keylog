import css from './fieldError.module.scss';
import { FieldError as RHFFieldError, InternalFieldErrors } from 'react-hook-form';

interface FieldErrorProps {
  error?: RHFFieldError | InternalFieldErrors;
  errors?: (RHFFieldError | InternalFieldErrors | undefined)[];
  className?: string;
}

// FieldError 와 InternalFieldErrors 타입 가드 함수
const isFieldError = (error: any): error is RHFFieldError => {
  return error && typeof error === 'object' && 'message' in error;
};

const extractErrorMessage = (err: RHFFieldError | InternalFieldErrors | undefined): string | undefined => {
  if (!err) return undefined;

  // message 프로퍼티가 있는 경우 (RHFFieldError)
  if (isFieldError(err)) {
    return err.message;
  }

  // InternalFieldErrors인 경우
  const firstErrorValue = Object.values(err)[0];
  return isFieldError(firstErrorValue) ? firstErrorValue.message : undefined;
};

export const FieldError = ({ error, errors, className = '' }: FieldErrorProps) => {
  let displayMessage: string = '';

  if (errors) {
    displayMessage += errors.map(extractErrorMessage).filter(Boolean).join('\n');
  } else if (error) {
    displayMessage += extractErrorMessage(error);
  }

  if (!displayMessage) return null;

  return <div className={`${css.fieldError} ${className}`}>{displayMessage}</div>;
};
