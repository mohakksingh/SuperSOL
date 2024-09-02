import React from 'react';
import Auth from './components/Auth';
import WalletBalance from './components/WalletBalance';
import TransactionHistory from './components/TransactionHistory';
import Giveaway from './components/Giveaway';
import NFTGiveaway from './components/NFTGiveaway';
import Superchat from './components/Superchat';
import LiveStream from './components/LiveStream';
import CreatorSettings from './components/CreatorSettings';
import Onboarding from './components/Onboarding';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana YouTube Superchat</h1>
        <Auth />
      </header>
      <main>
        <WalletBalance />
        <TransactionHistory />
        <Giveaway />
        <NFTGiveaway />
        <Superchat />
        <LiveStream />
        <CreatorSettings />
        <Onboarding />
      </main>
    </div>
  );
};

export default App;