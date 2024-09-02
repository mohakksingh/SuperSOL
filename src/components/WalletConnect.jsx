import React, { useEffect } from 'react';
import { useAddress, useMetamask, useDisconnect } from '@thirdweb-dev/react';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';

const WalletConnect = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const { toast } = useToast();

  useEffect(() => {
    if (address) {
      toast({
        title: 'Wallet connected',
        description: `Connected to wallet with address: ${address}`,
      });
    }
  }, [address, toast]);

  return (
    <div>
      {address ? (
        <Button onClick={disconnect}>Disconnect Wallet</Button>
      ) : (
        <Button onClick={connectWithMetamask}>Connect Wallet</Button>
      )}
    </div>
  );
};

export default WalletConnect;