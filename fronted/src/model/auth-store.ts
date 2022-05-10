import { httpClient } from '../services/http-service';
import { RootStore } from './root-store';

export class AuthStore {
  public isAuth: boolean = false;

  private rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  login = (username: string, password: string) => {
    httpClient
      .post('/login', {
        username,
        password
      })
      .then((response) => console.log(response));
  };
}
