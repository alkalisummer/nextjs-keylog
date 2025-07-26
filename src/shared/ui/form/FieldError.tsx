import css from './fieldError.module.scss';
import { FieldError as RHFFieldError } from 'react-hook-form';

interface FieldErrorProps {
  error?: RHFFieldError;
  errors?: (RHFFieldError | undefined)[];
  className?: string;
}

export const FieldError = ({ error, errors, className = '' }: FieldErrorProps) => {
  let displayMessage: string | undefined;

  if (errors) {
    displayMessage = errors.find(err => err?.message)?.message;
  } else if (error) {
    displayMessage = error.message;
  }

  if (!displayMessage) return null;

  return <div className={`${css.fieldError} ${className}`}>{displayMessage}</div>;
};
