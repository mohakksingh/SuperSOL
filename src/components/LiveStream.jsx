import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { useVideo } from '../contexts/VideoContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaYoutube, FaSearch, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const YOUTUBE_API_KEY = `${import.meta.env.VITE_YOUTUBE_API_KEY}`; 

const LiveStream = () => {
  const { setVideoUrl, setCreatorAddress } = useVideo();
  const [inputUrl, setInputUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
    setError(null); 
  };

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onError = (event) => {
    console.error('YouTube player error:', event.data);
    setError('An error occurred while loading the video. Please check the URL and try again.');
  };

  const extractVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      const searchParams = new URLSearchParams(urlObj.search);
      return searchParams.get('v') || urlObj.pathname.split('/').pop();
    } catch (err) {
      console.error('Error parsing URL:', err);
      return null;
    }
  };

  const fetchCreatorWallet = async (videoId) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: 'snippet',
          id: videoId,
          key: YOUTUBE_API_KEY,
        },
      });
      if (response.data.items && response.data.items.length > 0) {
        const description = response.data.items[0].snippet.description;
        const walletAddress = extractWalletAddress(description);
        setCreatorAddress(walletAddress);
      } else {
        setError('No video found with the given ID.');
      }
    } catch (error) {
      console.error('Error fetching creator wallet:', error);
      setError('Failed to fetch video details. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const extractWalletAddress = (description) => {
    const walletAddressRegex = /[A-Za-z0-9]{32,44}/; 
    const match = description.match(walletAddressRegex);
    return match ? match[0] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl) {
      const id = extractVideoId(inputUrl);
      if (id) {
        setVideoId(id);
        setVideoUrl(inputUrl);
        fetchCreatorWallet(id);
      } else {
        setError('Invalid YouTube URL. Please enter a valid URL.');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-red-900 to-pink-800 rounded-lg shadow-lg p-6 mb-8"
    >
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
        <FaYoutube className="mr-3 text-red-500" /> Live Stream
      </h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={inputUrl}
            onChange={handleInputChange}
            placeholder="Enter YouTube Video URL"
            className="w-full p-4 pr-12 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <FaSearch className="text-xl" />
          </button>
        </div>
      </form>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500 text-white p-4 rounded-lg mb-4 flex items-center"
          >
            <FaExclamationCircle className="mr-2 text-xl" /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500 text-white p-4 rounded-lg mb-4 flex items-center"
          >
            <FaCheckCircle className="mr-2 text-xl" /> Video loaded successfully!
          </motion.div>
        )}
      </AnimatePresence>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : videoId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-lg overflow-hidden shadow-2xl"
        >
          <YouTube
            videoId={videoId}
            opts={{
              height: '390',
              width: '100%',
              playerVars: {
                autoplay: 1,
              },
            }}
            onReady={onReady}
            onError={onError}
          />
        </motion.div>
      ) : (
        <div className="bg-gray-700 rounded-lg p-8 text-center mt-6">
          <FaYoutube className="text-6xl text-red-500 mb-4 mx-auto" />
          <p className="text-white text-lg">Enter a YouTube URL to start streaming</p>
        </div>
      )}
    </motion.div>
  );
};

export default LiveStream;