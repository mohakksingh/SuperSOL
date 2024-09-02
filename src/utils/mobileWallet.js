import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { Connection, PublicKey } from '@solana/web3.js';

export const connectMobileWallet = async () => {
  try {
    const { accounts } = await transact(async (wallet) => {
      const { accounts } = await wallet.getAccounts();
      return { accounts };
    });
    return accounts[0];
  } catch (err) {
    console.error('Error connecting mobile wallet:', err);
    return null;
  }
};

export const sendMobileTransaction = async (transaction) => {
  try {
    const connection = new Connection('https://solana-devnet.g.alchemy.com/v2/h6phOwxlgUqFY7waNm208YAE_OITiYpy');
    const { signature } = await transact(async (wallet) => {
      const { signature } = await wallet.signAndSendTransaction(transaction);
      return { signature };
    });
    await connection.confirmTransaction(signature, 'processed');
    return signature;
  } catch (err) {
    console.error('Error sending mobile transaction:', err);
    return null;
  }
};