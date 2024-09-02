import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';

const WalletConnect = () => {
  const { publicKey, connect, disconnect } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (publicKey) {
      toast({
        title: 'Wallet connected',
        description: `Connected to wallet with public key: ${publicKey.toString()}`,
      });
    }
  }, [publicKey, toast]);

  return (
    <div>
      {publicKey ? (
        <Button onClick={disconnect}>Disconnect Wallet</Button>
      ) : (
        <Button onClick={connect}>Connect Wallet</Button>
      )}
    </div>
  );
};

export default WalletConnect;