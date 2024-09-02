import React from 'react';
import { useAddress, useMetamask, useWalletConnect, useCoinbaseWallet, useDisconnect } from '@thirdweb-dev/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Auth = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const disconnect = useDisconnect();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-6 rounded-lg mb-8"
    >
      <h2 className="text-2xl text-white mb-4">Creator Authentication</h2>
      {address ? (
        <div>
          <p>Connected as: {address}</p>
          <Button onClick={disconnect} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Disconnect
          </Button>
        </div>
      ) : (
        <div>
          <Button onClick={connectWithMetamask} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2">
            Connect with Metamask
          </Button>
          <Button onClick={connectWithWalletConnect} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-2">
            Connect with WalletConnect
          </Button>
          <Button onClick={connectWithCoinbaseWallet} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
            Connect with Coinbase Wallet
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Auth;