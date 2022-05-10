import { computed, makeObservable, observable, toJS } from 'mobx';
import { createContext, useContext } from 'react';
import { httpClient } from '../services/http-service';
import { Employee } from './types';

export class RootStore {
  _employees: Employee[] = [];

  constructor() {
    makeObservable(this, {
      _employees: observable,
      employees: computed
    });
  }

  getEmployees = () => {
    httpClient.get('/employee').then((employees: Employee[]) => {
      this._employees = employees;
    });
  };

  get employees() {
    return toJS(this._employees);
  }
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
