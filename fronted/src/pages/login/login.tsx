import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState } from 'react';
import { ValidationError } from 'yup';
import * as yup from 'yup';

import { useAuth } from '../../feature/auth-provider';
import { useBoolean } from '../../utils/hooks';
import { parseYupErrors } from '../../utils/yup-helper';

import style from './login.module.scss';

interface LoginModel {
  username: string;
  password: string;
}

const LoginModelScheme = yup.object().shape({
  username: yup.string().required('No Username provided.'),
  password: yup
    .string()
    .required('No Password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
});

const LoginComponent = () => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, onToggleSighUp] = useBoolean(false);
  const [showPassword, onToggleShowPass] = useBoolean(false);

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

    if (!validate()) {
      return;
    }

    signIn(username, password).catch(() => {
      setError({
        server: 'Username or Password incorrect'
      });
    });
  }

  function handlerSignUp() {
    if (!validate()) {
      return;
    }

    const { username, password } = loginData;
    signUp(username, password, () => signIn(username, password)).catch((responseErr) => {
      setError({
        serverErr: responseErr.message
      });
    });
  }

  function validate() {
    try {
      LoginModelScheme.validateSync(loginData, { abortEarly: false });
      setError({});
    } catch (errors) {
      const dataErrors: Record<string, string> = parseYupErrors(errors as ValidationError);
      if (Object.keys(dataErrors).length) {
        setError(dataErrors);
        return false;
      }
    }

    return true;
  }

  function renderButtons() {
    return (
      <div className={style.buttons}>
        <Button variant={'contained'} onClick={isSignUp ? handlerSignUp : handlerSignIn}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <Button onClick={onToggleSighUp}>{isSignUp ? 'or sign in' : 'or sign up'}</Button>
      </div>
    );
  }

  function renderErrors() {
    let message = '';
    for (let field in errorData) {
      message += `${errorData[field]} `;
    }

    if (message) {
      return <FormHelperText error>{message}</FormHelperText>;
    }

    return null;
  }

  return (
    <div className={style.container}>
      <div className={style.loginForm}>
        <Typography variant={'h6'} className={style.title}>
          {isSignUp ? 'Sign Up' : 'Authorization'}
        </Typography>

        <div className={style.fields}>
          <FormControl fullWidth>
            <InputLabel htmlFor="name">Name</InputLabel>
            <OutlinedInput
              id="username"
              label="username"
              value={loginData.username}
              type="text"
              onChange={handlerChange}
              error={'username' in errorData}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              fullWidth
              id="password"
              label="password"
              value={loginData.password}
              type={showPassword ? 'text' : 'password'}
              error={'password' in errorData}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onToggleShowPass} onMouseDown={onToggleShowPass} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={handlerChange}
            />
          </FormControl>
          {renderErrors()}
        </div>

        {renderButtons()}
      </div>
    </div>
  );
};

export const LoginPage = observer(LoginComponent);
