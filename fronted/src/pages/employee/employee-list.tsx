import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../models/root-store';

import style from './employee.module.scss';

const EmployeeListComponent = () => {
  const { getEmployees } = useStore();

  useEffect(() => {
    getEmployees();
  }, []);

  return <div className={style.container}>asd</div>;
};

export const EmployeeList = observer(EmployeeListComponent);
