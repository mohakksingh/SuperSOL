import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { useVideo } from '../contexts/VideoContext';
import axios from 'axios';

const YOUTUBE_API_KEY = `${import.meta.env.VITE_YOUTUBE_API_KEY}`; 

const LiveStream = () => {
  const { setVideoUrl, setCreatorAddress } = useVideo();
  const [inputUrl, setInputUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
    setError(null); 
  };

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onError = (event) => {
    setError('An error occurred. Please try again later.');
  };

  useEffect(() => {
    if (inputUrl) {
      try {
        const url = new URL(inputUrl);
        const id = url.searchParams.get('v');
        if (id) {
          setVideoId(id);
          setVideoUrl(inputUrl);
          // Fetch creator's wallet address based on video URL
          fetchCreatorWallet(id);
        } else {
          setError('Invalid YouTube URL. Please enter a valid URL.');
        }
      } catch (err) {
        setError('Invalid URL. Please enter a valid YouTube URL.');
      }
    }
  }, [inputUrl]);

  const fetchCreatorWallet = async (videoId) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: 'snippet',
          id: videoId,
          key: YOUTUBE_API_KEY,
        },
      });
      const description = response.data.items[0].snippet.description;
      const walletAddress = extractWalletAddress(description);
      setCreatorAddress(walletAddress);
    } catch (error) {
      console.error('Error fetching creator wallet:', error);
    }
  };

  const extractWalletAddress = (description) => {
    const walletAddressRegex = /[A-Za-z0-9]{32,44}/; 
    const match = description.match(walletAddressRegex);
    console.log("this it mathc", match)
    return match ? match[0] : null;
  };

  useEffect(() => {
    if (player && videoId) {
      player.loadVideoById(videoId);
    }
  }, [videoId, player]);

  return (
    <div className="mb-8">
      <input
        type="text"
        value={inputUrl}
        onChange={handleInputChange}
        placeholder="Enter YouTube Video URL"
        className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
      />
      {error ? (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          {error}
        </div>
      ) : (
        <YouTube
          videoId={videoId}
          opts={{
            height: '390',
            width: '640',
            playerVars: {
              autoplay: 1,
            },
          }}
          onReady={onReady}
          onError={onError}
        />
      )}
    </div>
  );
};

export default LiveStream;