import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FaGift, FaSpinner } from 'react-icons/fa';

const NFTGiveaway = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [winnerAddress, setWinnerAddress] = useState('');
  const [creatorAddress, setCreatorAddress] = useState(null);
  const [loading, setLoading] = useState(false);
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

      toast({
        title: 'NFT sent',
        description: 'NFT sent successfully!',
      });
      setSelectedNFT(null);
      setWinnerAddress('');
      fetchNFTs(); 
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-800 to-indigo-900 p-6 rounded-lg shadow-lg mb-8"
    >
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
        <FaGift className="mr-3 text-yellow-400" /> NFT Giveaway
      </h2>
      {publicKey ? (
        <div className="space-y-4">
          <select
            value={selectedNFT ? selectedNFT.pubkey.toBase58() : ''}
            onChange={(e) => setSelectedNFT(nfts.find(nft => nft.pubkey.toBase58() === e.target.value))}
            className="w-full p-3 bg-purple-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full p-3 bg-purple-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            onClick={handleGiveaway}
            disabled={!selectedNFT || !winnerAddress || loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaGift className="mr-2" />
            )}
            {loading ? 'Sending...' : 'Give Away NFT'}
          </Button>
        </div>
      ) : (
        <p className="text-white text-center">Please connect your wallet to start an NFT giveaway.</p>
      )}
    </motion.div>
  );
};

export default NFTGiveaway;