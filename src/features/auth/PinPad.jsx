import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Fade, Stack, useTheme, keyframes } from '@mui/material';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';

// --- SECURITY: SHA-256 HASHING ---
const CORRECT_PIN_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

// Helper to hash input
const hashPin = async (pin) => {
  const msgBuffer = new TextEncoder().encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Shake Animation for Error
const shakeKeyframes = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
`;

const PinPad = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Only verify when 4 digits are entered
    if (pin.length === 4) {
      const verifyPin = async () => {
        setIsChecking(true);
        const hashedInput = await hashPin(pin);
        
        if (hashedInput === CORRECT_PIN_HASH) {
          // Success: Slight delay for visual feedback
          if (navigator.vibrate) navigator.vibrate(50);
          setTimeout(() => onUnlock(), 200);
        } else {
          // Fail: Shake and clear
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Double buzz
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
            setIsChecking(false);
          }, 500);
        }
      };
      verifyPin();
    }
  }, [pin, onUnlock]);

  const handleNumPress = (num) => {
    if (pin.length < 4 && !isChecking) {
      if (navigator.vibrate) navigator.vibrate(10); // Haptic feedback
      setPin((prev) => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  // --- STYLES ---
  const buttonSize = 85; // Massive buttons

  const buttonStyle = {
    height: buttonSize,
    width: buttonSize,
    borderRadius: '50%',
    fontSize: '2.2rem',
    fontWeight: 400,
    fontFamily: '"Google Sans", sans-serif',
    color: theme.palette.text.primary,
    bgcolor: 'rgba(255, 255, 255, 0.03)', // Very subtle glass
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    transition: 'all 0.15s ease-out',
    '&:active': {
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        transform: 'scale(0.95)'
    },
    '&:hover': {
        bgcolor: 'rgba(255, 255, 255, 0.08)' 
    }
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        backgroundImage: theme.palette.mode === 'dark' 
          ? 'radial-gradient(circle at 50% 10%, rgba(168, 199, 250, 0.08) 0%, transparent 40%)'
          : 'none',
      }}
    >
      <Fade in={true} timeout={600}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 5,
            animation: error ? `${shakeKeyframes} 0.4s ease-in-out` : 'none'
          }}
        >
          
          {/* Header Icon */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
             {isChecking && !error ? (
                <LockOpenIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
             ) : (
                <LockOutlinedIcon sx={{ fontSize: 48, color: error ? theme.palette.error.main : theme.palette.text.primary }} />
             )}
             
             <Typography variant="h6" sx={{ fontWeight: 500, letterSpacing: 1, opacity: 0.7 }}>
               {error ? 'WRONG PIN' : 'ENTER PIN'}
             </Typography>
          </Box>

          {/* Dots Indicator */}
          <Stack direction="row" spacing={3} sx={{ height: 20 }}>
            {[...Array(4)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: i < pin.length 
                    ? theme.palette.text.primary 
                    : 'transparent',
                  border: `2px solid ${theme.palette.text.primary}`,
                  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy transition
                  transform: i < pin.length ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </Stack>

          {/* Keypad */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            columnGap: 4, 
            rowGap: 3 
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button key={num} onClick={() => handleNumPress(num.toString())} sx={buttonStyle}>
                {num}
              </Button>
            ))}
            
            {/* Empty Spot */}
            <Box /> 
            
            <Button onClick={() => handleNumPress('0')} sx={buttonStyle}>0</Button>

            <Button onClick={handleDelete} sx={{ ...buttonStyle, border: 'none', bgcolor: 'transparent' }}>
              <BackspaceOutlinedIcon sx={{ fontSize: '1.8rem' }} />
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default PinPad;