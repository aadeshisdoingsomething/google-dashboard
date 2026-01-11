import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, Stack, Divider, useTheme 
} from '@mui/material';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import IosShareIcon from '@mui/icons-material/IosShare'; 
import MoreVertIcon from '@mui/icons-material/MoreVert'; 

const InstallAppSection = () => {
  const [isPwa, setIsPwa] = useState(true); 
  const [helpOpen, setHelpOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const checkPwa = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone || 
                           document.referrer.includes('android-app://');
      setIsPwa(isStandalone);
    };
    checkPwa();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkPwa);
  }, []);

  if (isPwa) return null;

  return (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, mb: 3, 
          borderRadius: '24px', // FIXED: Explicit px to avoid Pill shape
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(208, 188, 255, 0.08)' : '#E8DEF8',
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '16px' }}>
             <GetAppRoundedIcon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontSize="1rem" fontWeight={700}>
              Install Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enable full-screen mode for the best experience.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            disableElevation
            onClick={() => setHelpOpen(true)}
            sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
          >
            Install
          </Button>
        </Stack>
      </Paper>

      {/* Instructions Dialog */}
      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Installation Guide</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight={700}>iPhone / iPad (Safari)</Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                1. Tap the 3 dots (<MoreVertIcon fontSize="inherit" />) and then click the <b>Share</b> button <IosShareIcon fontSize="inherit" />
              </Typography>
              <Typography variant="body2">2. Scroll down and tap <b>"Add to Home Screen"</b>.</Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom fontWeight={700}>Android (Chrome)</Typography>
              {/* FIXED TEXT FLOW */}
              <Typography variant="body2" paragraph sx={{ mb: 0.5 }}>
                1. Tap the menu icon (<MoreVertIcon fontSize="inherit" style={{ verticalAlign: 'middle' }} />) in the browser bar.
              </Typography>
              <Typography variant="body2">
                2. Tap <b>"Install app"</b> or <b>"Add to Home screen"</b> in the list.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)} variant="text" sx={{ borderRadius: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InstallAppSection;