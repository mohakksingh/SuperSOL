import React, { useState, useEffect } from 'react';
import { ThirdwebProvider, useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';
import { createThirdwebClient } from '@thirdweb-dev/sdk';
import { ConnectButton } from '@thirdweb-dev/react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import LiveStream from './components/LiveStream';
import Superchat from './components/Superchat';
import Onboarding from './components/Onboarding';
import Giveaway from './components/Giveaway';
import NFTGiveaway from './components/NFTGiveaway';
import TransactionHistory from './components/TransactionHistory';
import WalletBalance from './components/WalletBalance';
import WalletConnect from './components/WalletConnect';
import axios from 'axios';
import { Button } from '@/components/ui/button';

import '@solana/wallet-adapter-react-ui/styles.css';

const client = createThirdwebClient({ clientId: `${import.meta.env.CLIENT_ID}` });

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

  useEffect(() => {
    if (address) {
      console.log('Address:', address);
      handleWalletConnect(address);
      fetchTransactions(address);
    } else {
      console.log('Address is not available');
    }
  }, [address]);

  const handleWalletConnect = async (address) => {
    try {
      setWalletAddress(address); // Update the wallet address state
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const fetchTransactions = async (address) => {
    try {
      const confirmedSignatures = await connection.getConfirmedSignaturesForAddress2(new PublicKey(address));
      const transactionDetails = await Promise.all(
        confirmedSignatures.map(async (signatureInfo) => {
          const transaction = await connection.getConfirmedTransaction(signatureInfo.signature);
          return transaction;
        })
      );
      setTransactions(transactionDetails);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const network = 'devnet';
  const endpoint = clusterApiUrl(network);
  const connection = new Connection(endpoint);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];

  return (
    <ThirdwebProvider clientId={`${import.meta.env.CLIENT_ID}`}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="container mx-auto px-4 py-8">
              <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Solana YouTube Superchat</h1>
                <div className="flex items-center space-x-4">
                  <ConnectButton client={client} />
                  <Button onClick={() => console.log('Address:', address ? address : 'Not connected')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Log Address
                  </Button>
                </div>
              </header>
              <main>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {!onboardingComplete && (
                    <Onboarding onComplete={() => setOnboardingComplete(true)} />
                  )}
                  {onboardingComplete && (
                    <>
                      <WalletBalance />
                      <WalletConnect />
                      <LiveStream />
                      <Superchat />
                      <Giveaway />
                      <NFTGiveaway />
                      <TransactionHistory transactions={transactions} />
                    </>
                  )}
                </motion.div>
              </main>
            </div>
            <Toaster position="bottom-right" />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThirdwebProvider>
  );
}

export default App;