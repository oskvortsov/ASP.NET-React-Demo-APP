import { ValidationError } from 'yup';

export function parseYupErrors(errors: ValidationError): Record<string, string> {
  const data: Record<string, string> = {};

  if (errors.inner) {
    errors.inner?.forEach((err) => {
      if (err.path && err.errors.length) {
        data[err.path] = err.errors[0];
      }
    });
  } else if (errors.path && errors.errors.length) {
    data[errors.path] = errors.errors[0];
  }

  return data;
}
