import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react';

const activeChainId = ChainId.Mainnet;

ReactDOM.render(
  <ThirdwebProvider desiredChainId={activeChainId}>
    <App />
  </ThirdwebProvider>,
  document.getElementById('root')
);