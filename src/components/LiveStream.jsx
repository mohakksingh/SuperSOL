import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { useVideo } from '../contexts/VideoContext';
import axios from 'axios';
import { FaYoutube, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import LiveChat from './LiveChat';

const YOUTUBE_API_KEY = `${import.meta.env.VITE_YOUTUBE_API_KEY}`;

const LiveStream = () => {
  const { setVideoUrl, setCreatorAddress } = useVideo();
  const [inputUrl, setInputUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [giveawayParticipants, setGiveawayParticipants] = useState([]);

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
    setError(null);
  };

  const onReady = (event) => {
    console.log('Player is ready');
  };

  const onError = (event) => {
    console.error('YouTube player error:', event.data);
    setError('An error occurred while loading the video. Please try again.');
    setVideoId('');
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

  const extractWalletAddress = (description) => {
    console.log('Searching for wallet address in description:', description);
    
    // Try to find a Solana address with the "solana:" prefix
    const solanaRegex = /solana:([A-Za-z0-9]{32,44})/;
    const solanaMatch = description.match(solanaRegex);
    if (solanaMatch) {
      console.log('Found Solana address with prefix:', solanaMatch[1]);
      return solanaMatch[1];
    }
    
    // If not found, try to find any 32-44 character string that looks like a Solana address
    const genericRegex = /\b([A-Za-z0-9]{32,44})\b/;
    const genericMatch = description.match(genericRegex);
    if (genericMatch) {
      console.log('Found potential Solana address:', genericMatch[1]);
      return genericMatch[1];
    }
    
    console.log('No wallet address found in description');
    return null;
  };

  const fetchCreatorWallet = async (videoId) => {
    setLoading(true);
    try {
      console.log('Fetching video details for ID:', videoId);
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: 'snippet',
          id: videoId,
          key: YOUTUBE_API_KEY,
        },
      });
      console.log('API response:', response.data);
      if (response.data.items && response.data.items.length > 0) {
        const description = response.data.items[0].snippet.description;
        console.log('Video description:', description);
        const walletAddress = extractWalletAddress(description);
        if (walletAddress) {
          console.log('Extracted wallet address:', walletAddress);
          setCreatorAddress(walletAddress);
        } else {
          setError('Creator address not found in video description.');
        }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl) {
      const id = extractVideoId(inputUrl);
      if (id) {
        console.log('Extracted video ID:', id);
        setVideoId(id);
        setVideoUrl(inputUrl);
        fetchCreatorWallet(id);
      } else {
        setError('Invalid YouTube URL. Please enter a valid URL.');
      }
    }
  };

  const handleParticipantsUpdate = (participants) => {
    setGiveawayParticipants(participants);
    // You can use this updated list of participants for other purposes in your app
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-fuchsia-900 p-6 rounded-lg shadow-lg mb-8">
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
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4 flex items-center">
          <FaExclamationCircle className="mr-2 text-xl" /> {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : videoId ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg overflow-hidden shadow-2xl">
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
          </div>
          <div className="h-[390px]">
            <LiveChat videoId={videoId} onParticipantsUpdate={handleParticipantsUpdate} />
          </div>
        </div>
      ) : (
        <div className="bg-gray-700 rounded-lg p-8 text-center">
          <FaYoutube className="text-6xl text-red-500 mb-4 mx-auto" />
          <p className="text-white text-lg">Enter a YouTube URL to start streaming</p>
        </div>
      )}
    </div>
  );
};

export default LiveStream;