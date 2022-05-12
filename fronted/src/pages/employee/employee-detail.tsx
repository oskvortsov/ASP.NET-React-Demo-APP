import { Button, TextField } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { ValidationError } from 'yup';

import { useStore } from '../../models/root-store';
import { Employee, createEmployee, employeeValidationScheme } from '../../models/employee';

import style from './employee.module.scss';

const NEW_PATH_NAME = 'new';

const EmployeeDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee>(createEmployee());
  const [error, setError] = useState<Record<string, string>>({});

  const { getEmployee, createOrUpdateEmployee, removeEmployee } = useStore();

  const isUpdating = id === NEW_PATH_NAME;

  useEffect(() => {
    if (id && !isUpdating) {
      getEmployee(id)
        .then(setEmployee)
        .catch((resErr) =>
          setError({
            server: resErr.message
          })
        );
    }
  }, [id]);

  function handlerFieldChange(event: ChangeEvent<HTMLInputElement>) {
    setEmployee({
      ...employee,
      [event.target.id]: event.target.value
    });
  }

  async function handlerAddUpdateClick() {
    try {
      await employeeValidationScheme.validate(employee, { abortEarly: false });
      setError({});
      await createOrUpdateEmployee(employee, isUpdating ? id : undefined);
      navigate('/employees');
    } catch (errors) {
      const dataErrors: Record<string, string> = {};

      (errors as ValidationError)?.inner.forEach((err) => {
        if (err.path && err.errors.length) {
          dataErrors[err.path] = err.errors[0];
        }
      });

      setError(dataErrors);
    }
  }

  function renderEmployee() {
    if (!employee) return null;

    const { name, email, birthDateTime, salary } = employee;

    return (
      <div className={style.formGroup}>
        <TextField
          id="name"
          label={'Name'}
          value={name}
          onChange={handlerFieldChange}
          error={'name' in error}
          helperText={error['name']}
        />
        <TextField
          id="email"
          label={'Email'}
          type={'email'}
          value={email}
          error={'email' in error}
          helperText={error['email']}
          onChange={handlerFieldChange}
        />
        <TextField
          id="salary"
          label={'Salary'}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={salary}
          error={'salary' in error}
          helperText={error['salary']}
          onChange={handlerFieldChange}
        />
        <TextField
          id="birthDateTime"
          label="Birthday"
          type="date"
          error={'birthDateTime' in error}
          helperText={error['birthDateTime']}
          value={birthDateTime}
          onChange={handlerFieldChange}
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
    );
  }

  function handlerRemove() {
    if (!id) return;

    removeEmployee(id).then(() => {
      navigate('/employees');
    });
  }

  function renderRemoveButton() {
    if (!isUpdating) {
      return null;
    }

    return (
      <div className={style.btnContainer}>
        <Button variant={'contained'} color={'warning'} onClick={handlerRemove}>
          Delete
        </Button>
      </div>
    );
  }

  function handlerBack() {
    navigate('/employees');
  }

  return (
    <div className={style.container}>
      <div className={style.form}>
        <div className={style.btnContainer}>
          <Button variant={'contained'} onClick={handlerAddUpdateClick}>
            {isUpdating ? 'Update' : 'Create'}
          </Button>
          <Button variant={'contained'} onClick={handlerBack}>
            Cancel
          </Button>
        </div>

        {renderEmployee()}

        {renderRemoveButton()}
      </div>
    </div>
  );
};

export const EmployeeDetail = observer(EmployeeDetailComponent);
