import React, { useMemo } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useSettings } from '../../../context/SettingsContext';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const CalendarWidget = ({ onOpenSettings }) => {
  const { calendarUrl } = useSettings();
  const theme = useTheme();

  // THE PERFECT FILTER
  // 1. invert(0.92): Turns White (255) -> ~#141414 (Your Dark Card Color).
  // 2. hue-rotate(180deg): Fixes the buttons to be Blue again.
  // 3. saturate(0.85): Removes just enough color noise to kill the "bluish black" tint without killing event colors.
  // 4. NO contrast(): This was the culprit making it #0a0a0a.
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

      // 1. CLEANUP PARAMS (The "Widget" Look)
      // These remove the ugly Google header, print icon, timezone, etc.
      urlObj.searchParams.set('showTitle', '0');
      urlObj.searchParams.set('showPrint', '0');
      urlObj.searchParams.set('showCalendars', '0');
      urlObj.searchParams.set('showTz', '0');
      
      // Keep Navigation (arrows) and Date so you can actually use it
      urlObj.searchParams.set('showTabs', '1');
      urlObj.searchParams.set('showNav', '1'); 
      urlObj.searchParams.set('showDate', '1');

      // 2. COLOR MATH
      if (theme.palette.mode === 'dark') {
        // We want the surrounding area to be #1b1b1b (Level 27).
        // The Card is #141414 (Level 20).
        // Since Invert flips brightness, to get a LIGHTER grey (27) than the card (20),
        // we need a DARKER source white.
        // #f5f5f5 (245) inverted @ 0.92 results in approx #1c1c1c.
        urlObj.searchParams.set('bgcolor', '#f5f5f5');
      } else {
        // Light mode: match your dashboard background
        urlObj.searchParams.set('bgcolor', '#f9fafd');
      }

      const finalUrl = urlObj.toString();
      console.log('Optimized Calendar URL:', finalUrl);
      return finalUrl;
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
        color: 'text.secondary' 
      }}>
        <CalendarMonthIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Typography variant="body1">Configure in settings.</Typography>
        <Button variant="outlined" onClick={onOpenSettings} sx={{ mt: 1 }}>
          Settings
        </Button>
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