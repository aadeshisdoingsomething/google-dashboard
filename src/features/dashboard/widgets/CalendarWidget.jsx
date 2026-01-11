import React, { useMemo, useState } from 'react';
import { Box, Typography, Button, useTheme, Stack } from '@mui/material';
import { useSettings } from '../../../context/SettingsContext';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// Import the instructions dialog (going back up to settings folder)
import CalendarHelpDialog from '../settings/CalendarHelpDialog';

const CalendarWidget = ({ onOpenSettings }) => {
  const { calendarUrl } = useSettings();
  const theme = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);

  // THE PERFECT FILTER
  // 1. invert(0.92): Turns White (255) -> ~#141414 (Your Dark Card Color).
  // 2. hue-rotate(180deg): Fixes the buttons to be Blue again.
  // 3. saturate(0.85): Removes just enough color noise.
  const iframeStyle = {
    border: 0, 
    width: '100%', 
    height: '100%',
    filter: theme.palette.mode === 'dark' 
      ? 'invert(0.92) hue-rotate(180deg) saturate(0.85)' 
      : 'none',
  };

  const optimizedUrl = useMemo(() => {
    if (!calendarUrl) return '';

    try {
      const urlObj = new URL(calendarUrl);

      // 1. CLEANUP PARAMS
      urlObj.searchParams.set('showTitle', '0');
      urlObj.searchParams.set('showPrint', '0');
      urlObj.searchParams.set('showTabs', '1'); // Kept as requested
      urlObj.searchParams.set('showCalendars', '0');
      urlObj.searchParams.set('showTz', '0');
      urlObj.searchParams.set('showNav', '1'); 
      urlObj.searchParams.set('showDate', '1');

      // 2. COLOR MATH
      if (theme.palette.mode === 'dark') {
        urlObj.searchParams.set('bgcolor', '#f5f5f5');
      } else {
        urlObj.searchParams.set('bgcolor', '#f9fafd');
      }

      return urlObj.toString();
    } catch (e) {
      console.error('Error parsing Calendar URL:', e);
      return calendarUrl;
    }
  }, [calendarUrl, theme.palette.mode]);

  if (!calendarUrl) {
    return (
      <Box sx={{ 
        height: '100%', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', gap: 2, p: 2, 
        color: 'text.secondary', textAlign: 'center'
      }}>
        <CalendarMonthIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        
        <Box>
          <Typography variant="h6" color="text.primary" gutterBottom>
            No Calendar Set
          </Typography>
          <Typography variant="body2">
            Add your Google Calendar URL in settings.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} mt={1}>
          <Button variant="contained" onClick={onOpenSettings} disableElevation>
            Open Settings
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<HelpOutlineIcon />} 
            onClick={() => setHelpOpen(true)}
          >
            How to?
          </Button>
        </Stack>

        <CalendarHelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', bgcolor: 'background.paper' }}>
      <iframe
        src={optimizedUrl}
        style={iframeStyle}
        frameBorder="0"
        scrolling="no"
        title="Google Calendar"
      ></iframe>
    </Box>
  );
};

export default CalendarWidget;