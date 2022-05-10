import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';

import { useStore } from '../../models/root-store';
import { Employee } from '../../models/types';

import style from './employee.module.scss';

const NEW_PATH_NAME = 'new';

export function createEmployee(): Employee {
  return {
    name: '',
    email: '',
    salary: 0
  };
}

enum Mode {
  CREATE,
  EDIT
}

const EmployeeDetailComponent = () => {
  const { id } = useParams();
  const { getEmployee } = useStore();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const mode = NEW_PATH_NAME === id ? Mode.CREATE : Mode.EDIT;

  useEffect(() => {
    if (id && mode === Mode.EDIT) {
      getEmployee(id).then(setEmployee);
    } else {
      setEmployee(createEmployee());
    }
  }, [id]);

  function renderEmployee() {
    if (!employee) return null;

    const { name, email, birthDateTime, salary } = employee;

    return (
      <div className={style.formGroup}>
        <TextField label={'Name'} value={name} />
        <TextField label={'Email'} type={'email'} value={email} />
        <TextField
          label={'Salary'}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={salary}
        />
        <TextField
          label="Birthday"
          type="date"
          value={birthDateTime}
          InputLabelProps={{
            shrink: true
          }}
        />
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
          <Button variant={'contained'}>{mode == Mode.EDIT ? 'Update' : 'Create'}</Button>
          <Button variant={'contained'} onClick={handlerBack}>
            Cancel
          </Button>
        </div>

        {renderEmployee()}
      </div>
    </div>
  );
};

export const EmployeeDetail = observer(EmployeeDetailComponent);
