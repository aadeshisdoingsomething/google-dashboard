import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, useTheme, keyframes, CircularProgress, Slider, Stack, Tooltip } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded';
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

// --- ANIMATIONS ---
const barAnim = keyframes`
  0% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.3); }
`;

// "Gemini" style animated bars
const Waveform = () => {
  const theme = useTheme();
  const barStyle = {
    width: 4,
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
  const [playlist, setPlaylist] = useState([]); // Array of news items
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());
  const theme = useTheme();

  // --- FETCH LOGIC ---
  const fetchNews = async (isAutoRefresh = false) => {
    // Don't auto-refresh interrupt if playing
    if (isAutoRefresh && isPlaying) return; 

    if (!isAutoRefresh) {
        setLoading(true);
        setError(false);
    }

    try {
      const RSS_URL = 'https://feeds.npr.org/500005/podcast.xml';
      const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(RSS_URL)}`;
      
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      const textData = await res.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textData, "text/xml");
      const items = xmlDoc.querySelectorAll('item');
      
      const newPlaylist = [];
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent;
        const pubDate = item.querySelector('pubDate')?.textContent;
        const enclosure = item.querySelector('enclosure');
        const audioUrl = enclosure ? enclosure.getAttribute('url') : null;
        
        if (audioUrl) {
          newPlaylist.push({ title, pubDate, audioUrl });
        }
      });

      if (newPlaylist.length > 0) {
        // If it's a manual refresh or first load, reset to top
        if (!isAutoRefresh) {
            setPlaylist(newPlaylist);
            setCurrentIndex(0);
            if (audioRef.current.src !== newPlaylist[0].audioUrl) {
                audioRef.current.src = newPlaylist[0].audioUrl;
                setProgress(0);
                setCurrentTime(0);
            }
        } else {
            // Smart update: if new top item is different, update playlist
            // but try to keep current index pointing to the same audio if possible, or reset.
            // For simplicity in a "News Now" context, we usually just update the list.
            if (newPlaylist[0].audioUrl !== playlist[0]?.audioUrl) {
                setPlaylist(newPlaylist);
                // We don't auto-play or reset index here to avoid jarring jumps,
                // the user will see the new time info when they hit next/prev or finish.
            }
        }
      } else {
        throw new Error("No audio found");
      }
    } catch (err) {
      console.error("Failed to fetch news feed", err);
      if (!isAutoRefresh) setError(true);
    } finally {
      if (!isAutoRefresh) setLoading(false);
    }
  };

  // --- LIFECYCLE ---
  useEffect(() => {
    fetchNews();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
        fetchNews(true);
    }, 5 * 60 * 1000);

    const audio = audioRef.current;

    const onTimeUpdate = () => {
        if (audio.duration) {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
            setProgress((audio.currentTime / audio.duration) * 100);
        }
    };

    const onEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        // Optional: Auto-play next item?
        // handleNext(); 
    };
    
    // External pause/play handlers (e.g. bluetooth headsets)
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
      clearInterval(interval);
    };
  }, []);

  // --- CONTROLS ---
  const loadTrack = (index) => {
    if (index >= 0 && index < playlist.length) {
        setCurrentIndex(index);
        audioRef.current.src = playlist[index].audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
    }
  };

  const handlePrev = () => {
      if (currentIndex < playlist.length - 1) {
          loadTrack(currentIndex + 1); // "Older" is further down the list
      }
  };

  const handleNext = () => {
      if (currentIndex > 0) {
          loadTrack(currentIndex - 1); // "Newer" is up the list
      }
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.error("Play failed", e));
  };

  const skipTime = (seconds) => {
    if (audioRef.current.duration) {
        audioRef.current.currentTime += seconds;
    }
  };

  const handleSeek = (event, newValue) => {
    if (audioRef.current.duration) {
        const newTime = (newValue / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress(newValue);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    // Format: "Oct 27 • 9:41 AM"
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
           ' • ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // --- RENDER ---
  if (loading) return (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} />
    </Box>
  );

  if (error || playlist.length === 0) return (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Typography variant="caption" color="error">News Unavailable</Typography>
        <IconButton size="small" onClick={() => fetchNews(false)}>
            <RefreshRoundedIcon fontSize="small" />
        </IconButton>
    </Box>
  );

  const currentItem = playlist[currentIndex];
  // Check availability for buttons
  const hasNewer = currentIndex > 0;
  const hasOlder = currentIndex < playlist.length - 1;

  return (
    <Box sx={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', 
      px: 2, gap: 2,
      position: 'relative',
      // Ensure it inherits theme background transparently
    }}>
      
      {/* 1. LOGO & REFRESH */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ 
          width: 42, height: 42, 
          bgcolor: '#D9352C', color: 'white',
          borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '0.8rem', letterSpacing: '-0.5px',
          boxShadow: '0 2px 8px rgba(217, 53, 44, 0.3)',
          flexShrink: 0
        }}>
          NPR
        </Box>
        {/* Manual Refresh (Tiny) */}
        <Tooltip title="Refresh Feed">
            <IconButton 
                size="small" 
                onClick={() => fetchNews(false)}
                sx={{ width: 20, height: 20, opacity: 0.5, '&:hover': { opacity: 1 } }}
            >
                <RefreshRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
        </Tooltip>
      </Box>

      {/* 2. INFO & PROGRESS (Flexible Middle) */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
         {/* Info Row */}
         <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: -0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {formatDateTime(currentItem.pubDate)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {new Date(currentTime * 1000).toISOString().substr(14, 5)} / {new Date((duration || 0) * 1000).toISOString().substr(14, 5)}
            </Typography>
         </Box>
         
         {/* Progress Slider */}
         <Slider 
            size="small"
            value={progress}
            onChange={handleSeek}
            sx={{
                height: 4,
                color: theme.palette.primary.main,
                '& .MuiSlider-thumb': {
                    width: 0, // Hidden thumb until hover usually looks cleaner for widget, or make small
                    height: 0,
                    transition: '0.2s',
                    '&:hover, &.Mui-active': { width: 10, height: 10 }
                },
                '& .MuiSlider-rail': { opacity: 0.2, backgroundColor: theme.palette.text.secondary }
            }}
         />
      </Box>

      {/* 3. CONTROLS (Right Side) */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
         {/* Prev / Older News */}
         <IconButton onClick={handlePrev} disabled={!hasOlder} size="small" sx={{ color: 'text.secondary', opacity: hasOlder ? 1 : 0.3 }}>
            <SkipPreviousRoundedIcon />
         </IconButton>

         {/* Skip -10 */}
         <IconButton onClick={() => skipTime(-10)} size="small" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}>
            <Replay10RoundedIcon fontSize="small" />
         </IconButton>

         {/* PLAY/PAUSE */}
         <Box 
            onClick={togglePlay}
            sx={{
              width: 50, height: 50,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'transform 0.1s',
              '&:active': { transform: 'scale(0.95)' },
              flexShrink: 0,
              mx: 1
            }}
         >
            {isPlaying ? <Waveform /> : <PlayArrowRoundedIcon sx={{ fontSize: 30 }} />}
         </Box>

         {/* Skip +10 */}
         <IconButton onClick={() => skipTime(10)} size="small" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}>
            <Forward10RoundedIcon fontSize="small" />
         </IconButton>

         {/* Next / Newer News */}
         <IconButton onClick={handleNext} disabled={!hasNewer} size="small" sx={{ color: 'text.secondary', opacity: hasNewer ? 1 : 0.3 }}>
            <SkipNextRoundedIcon />
         </IconButton>
      </Stack>

    </Box>
  );
};

export default NewsWidget;