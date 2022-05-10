import { makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { AuthStore } from './auth-store';

export class RootStore {
  public test: number = 1;

  public authStore: AuthStore;

  constructor() {
    makeObservable(this, {
      test: observable
    });

    this.authStore = new AuthStore(this);
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
