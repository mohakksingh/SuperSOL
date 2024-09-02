import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const register = (username, password, walletAddress) => 
  axios.post(`${API_URL}/auth/register`, { username, password, walletAddress });

export const login = (username, password) => 
  axios.post(`${API_URL}/auth/login`, { username, password });

export const getCreatorWallet = () => 
  axios.get(`${API_URL}/wallet/creator`, {
    headers: { 'x-auth-token': localStorage.getItem('token') }
  });