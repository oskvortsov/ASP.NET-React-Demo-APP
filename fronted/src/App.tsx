import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import './styles/index.scss';
import { RootStore, RootStoreProvider } from './model/root-store';

function App() {
  const rootStore = new RootStore();

  return (
    <RootStoreProvider value={rootStore}>
      <BrowserRouter>
        <div>asd</div>
      </BrowserRouter>
    </RootStoreProvider>
  );
}

export default App;
