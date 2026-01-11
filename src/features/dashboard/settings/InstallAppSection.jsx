import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, Stack, Divider, useTheme 
} from '@mui/material';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import IosShareIcon from '@mui/icons-material/IosShare'; // For iOS instructions
import MoreVertIcon from '@mui/icons-material/MoreVert'; // For Android instructions

const InstallAppSection = () => {
  const [isPwa, setIsPwa] = useState(true); // Default to true to prevent flash
  const [helpOpen, setHelpOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Check if running in standalone mode (PWA)
    const checkPwa = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone || 
                           document.referrer.includes('android-app://');
      setIsPwa(isStandalone);
    };

    checkPwa();
    
    // Listen for changes (e.g. if they install while open)
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkPwa);
  }, []);

  // If already installed/standalone, don't show anything
  if (isPwa) return null;

  return (
    <>
      {/* Prominent Banner */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, mb: 3, borderRadius: 3,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          display: 'flex', flexDirection: 'column', gap: 1
        }}
      >
        <Stack direction="row" alignItems="center" gap={1.5}>
          <GetAppRoundedIcon fontSize="large" />
          <Box>
            <Typography variant="h6" lineHeight={1.2} fontWeight={700}>
              Install as App
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Get the full screen experience.
            </Typography>
          </Box>
        </Stack>
        
        <Button 
          variant="contained" 
          onClick={() => setHelpOpen(true)}
          sx={{ 
            mt: 1, 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'inherit',
            fontWeight: 700,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
          }}
        >
          How to Install
        </Button>
      </Paper>

      {/* Instructions Dialog */}
      <Dialog 
        open={helpOpen} 
        onClose={() => setHelpOpen(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Installation Guide</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            
            {/* iOS */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight={700}>
                iPhone / iPad (Safari)
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                1. Tap the 3 dots (<MoreVertIcon fontSize="inherit" />) and then click the <b>Share</b> button <IosShareIcon fontSize="inherit" />
              </Typography>
              <Typography variant="body2">
                2. Scroll down and tap <b>"Add to Home Screen"</b>.
              </Typography>
            </Box>

            <Divider />

            {/* Android */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight={700}>
                Android (Chrome)
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                1. Tap the <b>Menu</b> button <MoreVertIcon fontSize="inherit" />
              </Typography>
              <Typography variant="body2">
                2. Tap <b>"Install app"</b> or <b>"Add to Home screen"</b>.
              </Typography>
            </Box>

            <Divider />

            {/* Desktop */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight={700}>
                Desktop (Chrome/Edge)
              </Typography>
              <Typography variant="body2">
                Look for the <b>Install Icon</b> (Computer with down arrow) on the right side of the URL bar.
              </Typography>
            </Box>

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)} variant="contained" sx={{ borderRadius: 4 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InstallAppSection;