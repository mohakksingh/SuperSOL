import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaSignOutAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const WalletConnect = () => {
  const { publicKey, disconnect, connected } = useWallet();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (publicKey) {
      toast({
        title: 'Wallet connected',
        description: `Connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
        icon: <FaCheckCircle className="h-5 w-5 text-green-500" />,
      });
    }
  }, [publicKey, toast]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: 'Wallet disconnected',
        description: 'Your wallet has been disconnected.',
        icon: <FaSignOutAlt className="h-5 w-5 text-yellow-500" />,
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast({
        variant: 'destructive',
        title: 'Disconnection Failed',
        description: 'Failed to disconnect wallet. Please try again.',
        icon: <FaExclamationCircle className="h-5 w-5 text-red-500" />,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-900 to-indigo-800 p-6 rounded-lg shadow-lg mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <FaWallet className="mr-2 text-yellow-400" /> Wallet Connection
      </h2>
      <AnimatePresence mode="wait">
        {connected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-blue-800 rounded-lg p-4 mb-4">
              <p className="text-white text-sm mb-2">Connected Wallet:</p>
              <p className="text-yellow-400 font-mono break-all">
                {publicKey.toString()}
              </p>
            </div>
            <Button
              onClick={handleDisconnect}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <FaSignOutAlt className="mr-2" /> Disconnect Wallet
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <WalletMultiButton className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WalletConnect;