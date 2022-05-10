import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../models/root-store';

const EmployeeListComponent = () => {
  const { employees, getEmployees } = useStore();

  useEffect(() => {
    getEmployees();
  }, []);

  console.log(employees);

  return <div>asd</div>;
};

export const EmployeeList = observer(EmployeeListComponent);
