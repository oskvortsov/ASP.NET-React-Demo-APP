import { makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

export class RootStore {
  public test: number = 1;

  constructor() {
    makeObservable(this, {
      test: observable
    });
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
