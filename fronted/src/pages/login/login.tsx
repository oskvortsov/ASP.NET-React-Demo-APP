import { Button, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../feature/auth-provider';

import style from './login.module.scss';

type LoginModel = {
  username: string;
  password: string;
};

const LoginComponent = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<LoginModel>({
    username: '',
    password: ''
  });

  const [errorData, setError] = useState<Record<string, string>>({});

  function handlerChange(event: ChangeEvent<HTMLInputElement>) {
    setLoginData({
      ...loginData,
      [event.target.id]: event.target.value
    });
  }

  function handlerSignIn() {
    const { username, password } = loginData;
    const error: Record<string, string> = {};

    if (!username) error['username'] = "Shouldn't be empty";
    if (!password) error['password'] = "Shouldn't be empty";

    if (Object.keys(error).length) {
      setError(error);
      return;
    }

    signIn(username, password, () => navigate('/'));
  }

  return (
    <div className={style.container}>
      <div className={style.loginForm}>
        <TextField
          id="username"
          label="username"
          value={loginData.username}
          type="text"
          onChange={handlerChange}
          error={'username' in errorData}
          helperText={errorData['username']}
        />
        <TextField
          id="password"
          label="password"
          value={loginData.password}
          type="password"
          error={'password' in errorData}
          helperText={errorData['password']}
          onChange={handlerChange}
        />
        <Button variant={'contained'} onClick={handlerSignIn}>
          Sign In
        </Button>
      </div>
    </div>
  );
};

export const LoginPage = observer(LoginComponent);