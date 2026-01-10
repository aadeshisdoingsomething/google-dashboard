import React from 'react';
import { Box, useTheme, keyframes } from '@mui/material';

const barAnim = keyframes`
  0% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.3); }
`;

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

export default Waveform;