import React, { useState } from 'react';
import { Box, Typography, IconButton, useTheme, CircularProgress, Slider, Stack, ButtonBase } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import RadioRoundedIcon from '@mui/icons-material/RadioRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

// Hooks & Components
import useNewsPlayer from '../../../hooks/useNewsPlayer';
import Waveform from './components/Waveform';
import LiveVisualizer from './components/LiveVisualizer';
import SourcePicker from './components/SourcePicker';
import NewsLogo from './components/NewsLogo';

const NewsWidget = () => {
  const theme = useTheme();
  const [pickerOpen, setPickerOpen] = useState(false);
  
  const {
    currentStation, changeStation,
    playlist, currentIndex, loading, error,
    isPlaying, progress, currentTime, duration,
    togglePlay, handleSeek, handleNext, handlePrev,
    // We can expose a reload for the manual refresh button if needed, 
    // but changeStation(current.id) acts as a refresh.
  } = useNewsPlayer();

  const handleStationSelect = (id) => {
    changeStation(id);
    setPickerOpen(false);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Data helpers
  const isLive = currentStation.type === 'live';
  const currentItem = isLive ? null : playlist[currentIndex];
  
  const mainTitle = isLive ? currentStation.name : (currentItem ? formatDateTime(currentItem.pubDate) : 'Loading...');
  const subTitle = isLive ? 'LIVE STREAM' : (currentItem ? currentItem.title : '');

  // Enable/Disable logic for buttons
  // RSS: disabled if at end of list. Live: Always enabled (circular).
  const prevDisabled = !isLive && currentIndex >= playlist.length - 1;
  const nextDisabled = !isLive && currentIndex <= 0;

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} />
    </Box>
  );

  return (
    <Box sx={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', 
      px: 2, gap: 2, position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* 1. OVERLAY PICKER */}
      <SourcePicker 
        open={pickerOpen} 
        onClose={() => setPickerOpen(false)} 
        currentId={currentStation.id}
        onSelect={handleStationSelect}
      />

      {/* 2. IDENTITY */}
      <ButtonBase 
        onClick={() => setPickerOpen(true)}
        sx={{ 
          display: 'flex', alignItems: 'center', gap: 1.5,
          p: 0.5, borderRadius: 2,
          transition: '0.2s',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        <Box sx={{ 
          width: 44, height: 44, 
          bgcolor: currentStation.color, 
          color: 'white',
          borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '0.75rem',
          boxShadow: `0 2px 8px ${currentStation.color}50`,
          flexShrink: 0
        }}>
          {isLive ? <RadioRoundedIcon fontSize="small" /> : currentStation.label}
        </Box>
        
        <Box sx={{ textAlign: 'left', minWidth: 80 }}>
           <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
             {mainTitle}
           </Typography>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
             {isLive && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main' }} />}
             <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100, display: 'block' }}>
               {subTitle}
             </Typography>
           </Box>
        </Box>
      </ButtonBase>

      {/* 3. CENTER: Progress (RSS) OR Visualizer (Live) */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 1 }}>
         {isLive ? (
            <LiveVisualizer isPlaying={isPlaying} />
         ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: -0.5 }}>
                 <Typography variant="caption" color="text.secondary">{formatTime(currentTime)}</Typography>
                 <Typography variant="caption" color="text.secondary">{formatTime(duration)}</Typography>
              </Box>
              <Slider 
                  size="small"
                  value={progress}
                  onChange={handleSeek}
                  sx={{
                      height: 4,
                      color: theme.palette.primary.main,
                      '& .MuiSlider-thumb': {
                          width: 0, height: 0, transition: '0.2s',
                          '&:hover, &.Mui-active': { width: 10, height: 10 }
                      },
                      '& .MuiSlider-rail': { opacity: 0.2, backgroundColor: theme.palette.text.secondary }
                  }}
              />
            </>
         )}
      </Box>

      {/* 4. CONTROLS */}
      <Stack direction="row" alignItems="center" spacing={1}>
         <IconButton 
            onClick={handlePrev} 
            disabled={prevDisabled}
            size="small" 
            sx={{ color: 'text.secondary', opacity: prevDisabled ? 0.3 : 1 }}
         >
            <SkipPreviousRoundedIcon />
         </IconButton>

         {/* PLAY BUTTON (Themed) */}
         <Box 
            onClick={togglePlay}
            sx={{
              width: 48, height: 48,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main, // Correct Theme Blue
              color: theme.palette.primary.contrastText, // Correct Contrast Text
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.1s',
              '&:active': { transform: 'scale(0.95)' },
              flexShrink: 0
            }}
         >
            {isPlaying ? (
               // RSS = Waveform, Live = Pause Icon
               !isLive ? <Waveform /> : <PauseRoundedIcon sx={{ fontSize: 28 }} />
            ) : (
               <PlayArrowRoundedIcon sx={{ fontSize: 28 }} />
            )}
         </Box>

         <IconButton 
            onClick={handleNext} 
            disabled={nextDisabled}
            size="small" 
            sx={{ color: 'text.secondary', opacity: nextDisabled ? 0.3 : 1 }}
         >
            <SkipNextRoundedIcon />
         </IconButton>
      </Stack>

    </Box>
  );
};

export default NewsWidget;