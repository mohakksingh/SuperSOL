import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
// import { register, login, getCreatorWallet } from '../services/api';
import { toast } from 'react-toastify';

const CreatorSettings = () => {
  const { publicKey } = useWallet();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchCreatorWallet();
    }
  }, []);

  const fetchCreatorWallet = async () => {
    try {
      const response = await getCreatorWallet();
      setCreatorAddress(response.data.walletAddress);
    } catch (error) {
      console.error('Error fetching creator wallet:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await register(username, password, publicKey.toString());
      toast.success('Registered successfully. Please log in.');
    } catch (error) {
      toast.error('Registration failed: ' + error.response.data.error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.data.token);
      setCreatorAddress(response.data.walletAddress);
      setIsLoggedIn(true);
    } catch (error) {
      toast.error('Login failed: ' + error.response.data.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCreatorAddress('');
  };

  if (isLoggedIn) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl mb-4">Creator Settings</h2>
        <p>Logged in as creator</p>
        <p>Wallet address: {creatorAddress}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-8">
      <h2 className="text-2xl mb-4">Creator Settings</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <button
        onClick={handleRegister}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Register
      </button>
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default CreatorSettings;