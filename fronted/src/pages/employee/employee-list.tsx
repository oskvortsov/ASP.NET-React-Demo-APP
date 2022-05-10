import { Button } from '@mui/material';
import { toJS } from 'mobx';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import { useStore } from '../../models/root-store';

import style from './employee.module.scss';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'name', headerName: 'Name', width: 100 },
  { field: 'email', headerName: 'Email', width: 170 },
  {
    field: 'birthDateTime',
    headerName: 'Birth Day',
    width: 150,
    valueGetter: dateTimeConvertor('birthDateTime')
  },
  { field: 'salary', headerName: 'Salary', width: 100 },
  {
    field: 'lastModifiedDate',
    headerName: 'Last Updated',
    width: 150,
    valueGetter: dateTimeConvertor('lastModifiedDate')
  }
];

function dateTimeConvertor(field: string) {
  return (params: GridValueGetterParams) => {
    return new Date(params.row[field]).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
}

const EmployeeListComponent = () => {
  const { employees, getEmployees } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    getEmployees();
  }, []);

  function handlerAddNew() {
    navigate('/employees/new');
  }

  return (
    <div className={style.container}>
      <div className={style.btnContainer}>
        <Button variant={'contained'} onClick={handlerAddNew}>
          Add new
        </Button>
      </div>

      <DataGrid
        rows={toJS(employees)}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export const EmployeeList = observer(EmployeeListComponent);
