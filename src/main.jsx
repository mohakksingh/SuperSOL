import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThirdwebProvider } from "@thirdweb-dev/react";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <ThirdwebProvider
      activeChain="ethereum"
      clientId="666a53b166faff499df59314427c43c2"
    >
    <App />
    </ThirdwebProvider>
  </React.StrictMode>,
)