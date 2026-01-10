import React from 'react';
import { Box, Typography, IconButton, useTheme, CircularProgress, Slider, Stack } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded';
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

// Hooks & Components
import useNewsPlayer from '../../../hooks/useNewsPlayer';
import Waveform from './components/Waveform';
import NewsLogo from './components/NewsLogo';

const NewsWidget = () => {
  const theme = useTheme();
  
  // Use the custom hook
  const {
    playlist, currentIndex, loading, error,
    isPlaying, progress, currentTime, duration,
    togglePlay, skipTime, handleSeek, handleNext, handlePrev, loadData
  } = useNewsPlayer();

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
           ' • ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // --- RENDER STATES ---
  if (loading) return (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} />
    </Box>
  );

  if (error || playlist.length === 0) return (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Typography variant="caption" color="error">News Unavailable</Typography>
        <IconButton size="small" onClick={() => loadData(false)}>
            <RefreshRoundedIcon fontSize="small" />
        </IconButton>
    </Box>
  );

  const currentItem = playlist[currentIndex];
  const hasNewer = currentIndex > 0;
  const hasOlder = currentIndex < playlist.length - 1;

  return (
    <Box sx={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', 
      px: 2, gap: 2, position: 'relative'
    }}>
      
      {/* 1. LOGO */}
      <NewsLogo onRefresh={() => loadData(false)} />

      {/* 2. INFO & PROGRESS */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
         <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: -0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {formatDateTime(currentItem.pubDate)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {new Date(currentTime * 1000).toISOString().substr(14, 5)} / {new Date((duration || 0) * 1000).toISOString().substr(14, 5)}
            </Typography>
         </Box>
         
         <Slider 
            size="small"
            value={progress}
            onChange={handleSeek}
            sx={{
                height: 4,
                color: theme.palette.primary.main,
                '& .MuiSlider-thumb': {
                    width: 0,
                    height: 0,
                    transition: '0.2s',
                    '&:hover, &.Mui-active': { width: 10, height: 10 }
                },
                '& .MuiSlider-rail': { opacity: 0.2, backgroundColor: theme.palette.text.secondary }
            }}
         />
      </Box>

      {/* 3. CONTROLS */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
         <IconButton onClick={handlePrev} disabled={!hasOlder} size="small" sx={{ color: 'text.secondary', opacity: hasOlder ? 1 : 0.3 }}>
            <SkipPreviousRoundedIcon />
         </IconButton>

         <IconButton onClick={() => skipTime(-10)} size="small" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}>
            <Replay10RoundedIcon fontSize="small" />
         </IconButton>

         {/* PLAY BUTTON */}
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

         <IconButton onClick={() => skipTime(10)} size="small" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}>
            <Forward10RoundedIcon fontSize="small" />
         </IconButton>

         <IconButton onClick={handleNext} disabled={!hasNewer} size="small" sx={{ color: 'text.secondary', opacity: hasNewer ? 1 : 0.3 }}>
            <SkipNextRoundedIcon />
         </IconButton>
      </Stack>

    </Box>
  );
};

export default NewsWidget;