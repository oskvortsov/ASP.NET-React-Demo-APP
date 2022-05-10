import { makeObservable, observable, runInAction } from 'mobx';
import { createContext, useContext } from 'react';
import { httpClient } from '../services/http-service';
import { Employee } from './types';

export class RootStore {
  employees: Employee[];

  constructor() {
    this.employees = [];

    makeObservable(this, {
      employees: observable
    });
  }

  getEmployees = () => {
    httpClient.get('/employee').then((employees: Employee[]) => {
      runInAction(() => {
        this.employees = employees;
      });
    });
  };

  getEmployee = async (id: string): Promise<Employee> => {
    return httpClient.get(`/employee/${id}`);
  };

  createOrUpdate = async (employee: Employee, id?: string) => {
    const url = id ? `/employee/${id}` : '/employee';
    const method = id ? 'put' : 'post';

    return httpClient[method](url, employee);
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
