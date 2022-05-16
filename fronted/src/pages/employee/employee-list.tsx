import { Button } from '@mui/material';
import { toJS } from 'mobx';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { DataGrid, GridColDef, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import { useStore } from '../../models/root-store';

import style from './employee.module.scss';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 150, sortable: false },
  { field: 'name', headerName: 'Name', width: 120 },
  { field: 'email', headerName: 'Email', width: 200 },
  {
    field: 'birthDateTime',
    headerName: 'Birth Day',
    width: 180,
    valueGetter: dateTimeConvertor('birthDateTime')
  },
  { field: 'salary', headerName: 'Salary', width: 100 }
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
  const {
    employees: { items, pagination, isLoading },
    getEmployees,
    filterEmployees
  } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    getEmployees();
  }, []);

  function handlerAddNew() {
    navigate('/employees/new');
  }

  function handlerRowClick(data: any) {
    const id = data.row.id;
    navigate(`/employees/${id}`);
  }

  function handlerPageChange(pageNumber: number) {
    filterEmployees({
      pageNumber
    });
  }

  function handlerPageSizeChange(pageSize: number) {
    filterEmployees({
      pageNumber: 0,
      pageSize
    });
  }

  function handlerSortChange(model: GridSortModel) {
    if (!model.length) return;
    const [{ field, sort }] = model;
    const orderBy = `${field} ${sort}`;

    filterEmployees({
      orderBy
    });
  }

  return (
    <div className={style.container}>
      <div className={style.btnContainer}>
        <Button variant={'contained'} onClick={handlerAddNew}>
          Add new
        </Button>
      </div>

      <DataGrid
        rows={toJS(items)}
        columns={columns}
        pageSize={pagination.PageSize}
        rowCount={pagination.TotalCount}
        rowsPerPageOptions={[2, 4, 10]}
        loading={isLoading}
        paginationMode={'server'}
        sortingMode={'server'}
        disableColumnFilter
        disableColumnMenu
        disableSelectionOnClick={true}
        onRowClick={handlerRowClick}
        onPageChange={handlerPageChange}
        onPageSizeChange={handlerPageSizeChange}
        onSortModelChange={handlerSortChange}
      />
    </div>
  );
};

export const EmployeeList = observer(EmployeeListComponent);
