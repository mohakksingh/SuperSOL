import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getCreatorWallet } from '../services/api';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NFTGiveaway = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [winnerAddress, setWinnerAddress] = useState('');
  const [creatorAddress, setCreatorAddress] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (publicKey) {
      fetchNFTs();
      fetchCreatorAddress();
    }
  }, [publicKey, connection]);

  const fetchNFTs = async () => {
    if (!publicKey) return;

    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      const nftAccounts = tokenAccounts.value.filter(
        (account) => account.account.data.parsed.info.tokenAmount.amount === '1' &&
                     account.account.data.parsed.info.tokenAmount.decimals === 0
      );

      setNfts(nftAccounts);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  const fetchCreatorAddress = async () => {
    try {
      const response = await getCreatorWallet();
      setCreatorAddress(response.data.walletAddress);
    } catch (error) {
      console.error('Error fetching creator wallet:', error);
    }
  };

  const handleGiveaway = async () => {
    if (!publicKey || !selectedNFT || !winnerAddress) return;

    try {
      const winnerPublicKey = new PublicKey(winnerAddress);
      const nftMint = new PublicKey(selectedNFT.account.data.parsed.info.mint);

      const fromTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        publicKey
      );

      const toTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        winnerPublicKey
      );

      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          publicKey,
          1,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');

      // After successful NFT transfer
      // await axios.post(`${import.meta.env.REACT_APP_BACKEND_URL}/api/transactions`, {
      //   type: 'nft',
      //   sender: publicKey.toString(),
      //   recipient: winnerAddress,
      //   nftId: selectedNFT.account.data.parsed.info.mint,
      //   message: 'NFT Giveaway'
      // }, { withCredentials: true });

      toast({
        title: 'NFT sent',
        description: 'NFT sent successfully!',
      });
      setSelectedNFT(null);
      setWinnerAddress('');
      fetchNFTs(); // Refresh the NFT list
    } catch (error) {
      console.error('Error giving away NFT:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send NFT. Please try again.',
      });
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-8">
      <h2 className="text-2xl mb-4">NFT Giveaway</h2>
      {publicKey ? (
        <>
          <select
            value={selectedNFT ? selectedNFT.pubkey.toBase58() : ''}
            onChange={(e) => setSelectedNFT(nfts.find(nft => nft.pubkey.toBase58() === e.target.value))}
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          >
            <option value="">Select an NFT</option>
            {nfts.map((nft) => (
              <option key={nft.pubkey.toBase58()} value={nft.pubkey.toBase58()}>
                {nft.account.data.parsed.info.mint}
              </option>
            ))}
          </select>
          <Input
            type="text"
            value={winnerAddress}
            onChange={(e) => setWinnerAddress(e.target.value)}
            placeholder="Winner's wallet address"
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <Button
            onClick={handleGiveaway}
            disabled={!selectedNFT || !winnerAddress}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Give Away NFT
          </Button>
        </>
      ) : (
        <p>Please connect your wallet to start an NFT giveaway.</p>
      )}
    </div>
  );
};

export default NFTGiveaway;