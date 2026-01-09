import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, useTheme, keyframes, CircularProgress } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded';
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded';
import RefreshIcon from '@mui/icons-material/Refresh';

// --- ANIMATIONS ---
const barAnim = keyframes`
  0% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.3); }
`;

// The "Gemini Live" style waveform
const Waveform = () => {
  const theme = useTheme();
  const barStyle = {
    width: 4,
    // Uses contrastText (dark) because the button background is now Light Blue (primary.main)
    backgroundColor: theme.palette.primary.contrastText, 
    borderRadius: 2,
    animation: `${barAnim} 1.2s ease-in-out infinite`,
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', height: 16 }}>
      <Box sx={{ ...barStyle, height: 12, animationDelay: '0s' }} />
      <Box sx={{ ...barStyle, height: 16, animationDelay: '0.1s' }} />
      <Box sx={{ ...barStyle, height: 14, animationDelay: '0.2s' }} />
      <Box sx={{ ...barStyle, height: 10, animationDelay: '0.3s' }} />
    </Box>
  );
};

const NewsWidget = () => {
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const theme = useTheme();

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const RSS_URL = 'https://feeds.npr.org/500005/podcast.xml';
      const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(RSS_URL)}`;
      
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      
      const textData = await res.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textData, "text/xml");
      const item = xmlDoc.querySelector('item');
      
      if (item) {
        const pubDate = item.querySelector('pubDate').textContent;
        const enclosure = item.querySelector('enclosure');
        const audioUrl = enclosure ? enclosure.getAttribute('url') : null;

        if (audioUrl) {
          setNewsItem({ pubDate, audioUrl });
          if (audioRef.current.src !== audioUrl) {
            audioRef.current.src = audioUrl;
          }
        } else {
          throw new Error("No audio found");
        }
      }
    } catch (err) {
      console.error("Failed to fetch news feed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    const audio = audioRef.current;
    const onEnded = () => setIsPlaying(false);
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.error("Play failed", e));
  };

  const skipTime = (seconds) => {
    if (audioRef.current.duration) {
        audioRef.current.currentTime += seconds;
    }
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} />
    </Box>
  );

  if (error || !newsItem) return (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Typography variant="caption" color="error">Failed to load news</Typography>
        <IconButton size="small" onClick={fetchNews}>
            <RefreshIcon fontSize="small" />
        </IconButton>
    </Box>
  );

  return (
    <Box sx={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: 3, py: 1,
      // REMOVED custom bgcolor to let it inherit the Theme's Paper color (#131314)
    }}>
      
      {/* 1. LOGO */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          width: 44, height: 44, 
          bgcolor: '#D9352C', 
          color: 'white',
          borderRadius: 3, // Slightly softer edges
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '0.85rem',
          letterSpacing: '-0.5px',
          boxShadow: '0 2px 8px rgba(217, 53, 44, 0.3)'
        }}>
          NPR
        </Box>
        <Box>
           <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
             News Now
           </Typography>
           <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
             {getRelativeTime(newsItem.pubDate)}
           </Typography>
        </Box>
      </Box>

      {/* 2. CONTROLS */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
         <IconButton onClick={() => skipTime(-10)} size="small" sx={{ color: 'text.secondary' }}>
            <Replay10RoundedIcon />
         </IconButton>

         {/* MAIN PLAY BUTTON */}
         <Box 
            onClick={togglePlay}
            sx={{
              width: 56, height: 56,
              borderRadius: '50%', // Circle
              bgcolor: 'primary.main', // Uses the Light Blue (#a8c7fa) from theme
              color: 'primary.contrastText', // Uses Dark text for contrast
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              '&:hover': { transform: 'scale(1.05)', opacity: 0.9 },
              '&:active': { transform: 'scale(0.95)' }
            }}
         >
            {isPlaying ? (
              <Waveform />
            ) : (
              <PlayArrowRoundedIcon sx={{ fontSize: 32 }} />
            )}
         </Box>

         <IconButton onClick={() => skipTime(10)} size="small" sx={{ color: 'text.secondary' }}>
            <Forward10RoundedIcon />
         </IconButton>
      </Box>

    </Box>
  );
};

export default NewsWidget;