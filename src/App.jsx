import React, { useState, useEffect } from 'react';
import { WalletMultiButton, WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
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
import { VideoProvider } from './contexts/VideoContext';

import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const { publicKey, connect, connected } = useWallet();
  const { connectionWallet } = useConnection();
  const [publicKeys, setPublicKeys] = useState(null);

  useEffect(() => {
    const fetchPublicKey = async () => {
      setPublicKeys(publicKey ? publicKey.toString() : null);
      console.log(publicKey ? publicKey.toString() : 'No public key available');
    };
    fetchPublicKey();
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      console.log('Public Key:', publicKey.toString());
      handleWalletConnect(publicKey);
      fetchTransactions(publicKey);
    } else {
      console.log('Public Key is not available');
    }
  }, [publicKey]);

  const network = 'devnet';
  const endpoint = clusterApiUrl(network);
  const connection = new Connection(endpoint);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];


  const fetchTransactions = async (publicKey) => {
    try {
      const confirmedSignatures = await connection.getConfirmedSignaturesForAddress2(new PublicKey(publicKey));
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

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <VideoProvider>
            <div className="container mx-auto px-4 py-8">
              <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Solana YouTube Superchat</h1>
                <div className="flex items-center space-x-4">
                  <WalletMultiButton />
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
                      <TransactionHistory />
                    </>
                  )}
                </motion.div>
              </main>
            </div>
            <Toaster position="bottom-right" />
          </VideoProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;