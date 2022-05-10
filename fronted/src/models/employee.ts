import * as yup from 'yup';

export interface Employee {
  id?: number;
  name: string;
  email: string;
  birthDateTime?: Date;
  salary: number;
  lastModifiedDate?: string;
}

export function createEmployee(): Employee {
  return {
    name: '',
    email: '',
    salary: 0,
    birthDateTime: new Date()
  };
}

export const employeeValidationScheme = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  salary: yup.number().min(0).max(9999999),
  birthDateTime: yup.date()
});
