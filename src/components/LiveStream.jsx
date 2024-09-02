import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

const LiveStream = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setVideoUrl(e.target.value);
    setError(null); // Clear any previous errors
  };

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onError = (event) => {
    setError('An error occurred. Please try again later.');
  };

  useEffect(() => {
    if (videoUrl) {
      try {
        const url = new URL(videoUrl);
        const id = url.searchParams.get('v');
        if (id) {
          setVideoId(id);
        } else {
          setError('Invalid YouTube URL. Please enter a valid URL.');
        }
      } catch (err) {
        setError('Invalid URL. Please enter a valid YouTube URL.');
      }
    }
  }, [videoUrl]);

  useEffect(() => {
    if (player && videoId) {
      player.loadVideoById(videoId);
    }
  }, [videoId, player]);

  return (
    <div className="mb-8">
      <input
        type="text"
        value={videoUrl}
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