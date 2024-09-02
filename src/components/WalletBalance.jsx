// src/components/WalletBalance.jsx
import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const WalletBalance = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {  
      if (!publicKey) {
        setBalance(null);
        return;
      }
      try {
        const walletBalance = await connection.getBalance(publicKey);
        setBalance(walletBalance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      }
    };

    fetchBalance();
    // Set up an interval to refresh the balance every 30 seconds
    const intervalId = setInterval(fetchBalance, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [publicKey, connection]);

  if (!publicKey) {
    return <div>Connect your wallet to see balance</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl mb-2">Wallet Balance</h2>
      {balance !== null ? (
        <p>{balance.toFixed(4)} SOL</p>
      ) : (
        <p>Loading balance...</p>
      )}
    </div>
  );
};

export default WalletBalance;