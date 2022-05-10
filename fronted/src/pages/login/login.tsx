import { Button, TextField, Typography } from '@mui/material';
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
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setSignUp] = useState(false);

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

    if (isValid()) {
      signIn(username, password);
    }
  }

  function handlerSignUp() {
    const { username, password } = loginData;
    signUp(username, password, () => signIn(username, password)).catch(() => {
      setError({
        password: 'Username and password should be strong'
      });
    });
  }

  function isValid() {
    const { username, password } = loginData;
    const error: Record<string, string> = {};

    if (!username) error['username'] = "Shouldn't be empty";
    if (!password) error['password'] = "Shouldn't be empty";

    if (Object.keys(error).length) {
      setError(error);
      return false;
    }

    return true;
  }

  function renderButtons() {
    if (isSignUp) {
      return (
        <>
          <Button variant={'contained'} onClick={handlerSignUp}>
            Sign Up
          </Button>
          <Button onClick={() => setSignUp(!isSignUp)}>or sign in</Button>
        </>
      );
    }

    return (
      <>
        <Button variant={'contained'} onClick={handlerSignIn}>
          Sign In
        </Button>
        <Button onClick={() => setSignUp(!isSignUp)}>or sign up</Button>
      </>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.loginForm}>
        <Typography variant={'h6'} className={style.title}>
          {isSignUp ? 'Sign Up' : 'Authorization'}
        </Typography>
        <TextField
          fullWidth
          id="username"
          label="username"
          value={loginData.username}
          type="text"
          onChange={handlerChange}
          error={'username' in errorData}
          helperText={errorData['username']}
        />
        <TextField
          fullWidth
          id="password"
          label="password"
          value={loginData.password}
          type="password"
          error={'password' in errorData}
          helperText={errorData['password']}
          onChange={handlerChange}
        />

        {renderButtons()}
      </div>
    </div>
  );
};

export const LoginPage = observer(LoginComponent);
