import { makeObservable, observable, runInAction } from 'mobx';
import { createContext, useContext } from 'react';
import { stringify as encodeQueryParams } from 'query-string';

import { httpClient } from '../services/http-service';
import { initPagination, Pagination, PaginationResponse } from './common';
import { Employee } from './employee';

export class RootStore {
  employees: {
    items: Employee[];
    pagination: Pagination;
    orderBy: string;
    isLoading: boolean;
  };

  constructor() {
    this.employees = {
      items: [],
      isLoading: false,
      orderBy: '',
      pagination: initPagination()
    };

    makeObservable(this, {
      employees: observable
    });
  }

  filterEmployees = ({
    pageNumber,
    pageSize,
    orderBy
  }: {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: string;
  }) => {
    if (pageNumber !== undefined) {
      this.employees.pagination.CurrentPage = pageNumber + 1;
    }

    if (orderBy !== undefined) {
      this.employees.orderBy = orderBy;
    }

    if (pageSize !== undefined) {
      this.employees.pagination.PageSize = pageSize;
    }

    this.getEmployees();
  };

  getEmployees = () => {
    this.employees.isLoading = true;
    const {
      pagination: { CurrentPage, PageSize },
      orderBy
    } = this.employees;

    const params: Record<string, string | number> = {
      PageNumber: CurrentPage,
      PageSize
    };

    if (orderBy) {
      params['OrderBy'] = orderBy;
    }

    const url = `/employee?${encodeQueryParams(params)}`;

    httpClient.get(url).then((data: PaginationResponse<Employee[]>) => {
      runInAction(() => {
        this.employees = {
          ...this.employees,
          ...data,
          isLoading: false
        };
      });
    });
  };

  getEmployee = async (id: string): Promise<Employee> => {
    return httpClient.get(`/employee/${id}`);
  };

  createOrUpdateEmployee = async (employee: Employee, id?: string) => {
    const url = id ? `/employee/${id}` : '/employee';
    const method = id ? 'put' : 'post';

    return httpClient[method](url, employee);
  };

  removeEmployee = async (id?: string) => {
    return httpClient.delete(`/employee/${id}`);
  };
}

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = RootStoreContext.Provider;

export function useStore() {
  const store = useContext(RootStoreContext);

  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }

  return store;
}
