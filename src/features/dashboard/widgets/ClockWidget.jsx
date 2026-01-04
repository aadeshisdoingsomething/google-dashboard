import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import { useSettings } from '../../../context/SettingsContext';

const ClockWidget = () => {
  const [now, setNow] = useState(new Date());
  const { timeFormat, effectiveTheme, worldClock1, worldClock2 } = useSettings();
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Helpers ---
  const getTimeInZone = (date, zone) => {
    try {
      const options = { hour: 'numeric', minute: '2-digit', hour12: timeFormat === '12h' };
      if (zone) options.timeZone = zone;
      
      let timeStr = date.toLocaleTimeString('en-US', options);
      
      if (timeFormat === '12h') {
        const ampm = timeStr.slice(-2);
        const time = timeStr.slice(0, -3).trim(); 
        return { time, ampm };
      }
      return { time: timeStr, ampm: '' };
    } catch (e) {
      return { time: '--:--', ampm: '' };
    }
  };

  const getDateInZone = (date, zone) => {
    try {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      if (zone) options.timeZone = zone;
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return '';
    }
  };

  // --- Layout Logic ---
  const hasWorldClocks = worldClock1.show || worldClock2.show;
  const localTime = getTimeInZone(now, undefined);
  const localDate = getDateInZone(now, undefined);
  
  // Colors
  const textColor = theme.palette.text.primary;
  const subTextColor = theme.palette.text.secondary;
  const accentColor = theme.palette.primary.main;

  // Reusable Component for a World Clock Item to ensure consistency
  const WorldClockItem = ({ settings }) => {
    const timeData = getTimeInZone(now, settings.zone);
    const dateStr = getDateInZone(now, settings.zone);

    return (
      <Box sx={{ 
        width: '100%', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
        py: 1
      }}>
        {/* City Title - Larger */}
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase',
          color: subTextColor,
          fontSize: '1rem',
          lineHeight: 1
        }}>
          {settings.city}
        </Typography>

        {/* Scalable SVG Time */}
        <Box sx={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '60px' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="xMidYMid meet">
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
              fill={textColor} style={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 400, fontSize: '32px' }}>
              {timeData.time}
            </text>
          </svg>
        </Box>

        {/* Date + AM/PM */}
        <Typography variant="caption" sx={{ color: subTextColor, mt: -0.5, textAlign: 'center' }}>
           {timeFormat === '12h' && <span style={{ color: accentColor, fontWeight: 600, marginRight: 4 }}>{timeData.ampm}</span>}
           {dateStr}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      width: '100%', height: '100%', display: 'flex', 
      flexDirection: hasWorldClocks ? 'row' : 'column',
      alignItems: 'center', justifyContent: 'center',
      p: 2, position: 'relative', overflow: 'hidden'
    }}>
      
      {/* ==========================
          LEFT SIDE (Main Clock) 
          Flex: 1.5 to give it slightly more weight than the sidebar
         ========================== */}
      <Box sx={{ 
        flex: hasWorldClocks ? 1.5 : 1, 
        display: 'flex', flexDirection: 'column', 
        alignItems: 'center', // Always center in its box
        justifyContent: 'center',
        height: '100%', width: '100%'
      }}>
         
         {/* SVG Time */}
         <Box sx={{ 
           width: '100%', flex: 1, display: 'flex', 
           alignItems: 'center', justifyContent: 'center',
           maxHeight: hasWorldClocks ? '70%' : '80%' 
         }}>
            <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet">
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                fill={textColor} style={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 400, fontSize: '65px' }}>
                {localTime.time}
              </text>
            </svg>
         </Box>

         {/* Date */}
         <Box sx={{ mt: -1, textAlign: 'center', width: '100%' }}>
            <Typography variant="h6" sx={{ color: subTextColor, fontWeight: 400, lineHeight: 1.2 }}>
               {timeFormat === '12h' && <span style={{ marginRight: 8, fontWeight: 500, color: accentColor }}>{localTime.ampm}</span>}
               {localDate}
            </Typography>
         </Box>
      </Box>


      {/* ==========================
          RIGHT SIDE (World Clocks) 
         ========================== */}
      {hasWorldClocks && (
        <>
          <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: theme.palette.divider, opacity: 0.5 }} />

          <Box sx={{ 
            flex: 1, height: '100%', display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-evenly', // Even spacing
            alignItems: 'center',
            minWidth: '120px'
          }}>
            
            {worldClock1.show && <WorldClockItem settings={worldClock1} />}

            {worldClock1.show && worldClock2.show && (
               <Divider sx={{ width: '80%', opacity: 0.2 }} />
            )}

            {worldClock2.show && <WorldClockItem settings={worldClock2} />}

          </Box>
        </>
      )}

    </Box>
  );
};

export default ClockWidget;