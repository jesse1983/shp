import React from 'react';
import Main from './Components/Main';
import { StoreProvider } from './Stores';

export default () => (
  <StoreProvider>
    <Main />
  </StoreProvider>
);
