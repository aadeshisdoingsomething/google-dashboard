import React from 'react';
import { Box, useTheme, keyframes } from '@mui/material';

const bounce = keyframes`
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
`;

const LiveVisualizer = ({ isPlaying }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 0.5, 
      height: 24, 
      width: '100%',
      opacity: isPlaying ? 1 : 0.3,
      transition: 'opacity 0.3s'
    }}>
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 4,
            height: '100%',
            bgcolor: theme.palette.primary.main,
            borderRadius: 2,
            animation: isPlaying ? `${bounce} ${0.8 + Math.random() * 0.5}s ease-in-out infinite` : 'none',
            animationDelay: `${Math.random() * 0.5}s`,
            transformOrigin: 'bottom', // Grow from bottom
            transform: isPlaying ? 'scaleY(1)' : 'scaleY(0.2)' // Idle state
          }}
        />
      ))}
    </Box>
  );
};

export default LiveVisualizer;