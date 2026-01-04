import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Box, Paper, IconButton, useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import ClockWidget from './widgets/ClockWidget';
import WeatherWidget from './widgets/WeatherWidget';
import CalendarWidget from './widgets/CalendarWidget';
import SettingsPanel from './SettingsPanel';
import { useSettings } from '../../context/SettingsContext'; // Import context

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const theme = useTheme();
  
  // Get visibility settings
  const { showWidgetClock, showWidgetWeather, showWidgetCalendar } = useSettings();

  // Dynamically build layout based on visibility
  // We keep the positions stable, but remove items from array if hidden
  const getLayouts = () => {
    const baseLg = [
      { i: 'clock', x: 0, y: 0, w: 2, h: 2 },
      { i: 'weather', x: 2, y: 0, w: 2, h: 2 },
      { i: 'calendar', x: 0, y: 2, w: 4, h: 4 },
    ];
    // Filter out hidden widgets
    const visibleLg = baseLg.filter(item => {
      if (item.i === 'clock' && !showWidgetClock) return false;
      if (item.i === 'weather' && !showWidgetWeather) return false;
      if (item.i === 'calendar' && !showWidgetCalendar) return false;
      return true;
    });

    return { lg: visibleLg, md: visibleLg, sm: visibleLg }; // Simplified for demo
  };

  const paperStyle = {
    borderRadius: '28px',
    overflow: 'hidden',
    bgcolor: 'background.paper',
    display: 'flex', flexDirection: 'column', position: 'relative',
  };

  const DragHandle = () => (
    <Box className="drag-handle" sx={{
        height: 24, width: '100%', cursor: 'grab', display: 'flex', justifyContent: 'center',
        paddingTop: 1, position: 'absolute', top: 0, left: 0, zIndex: 10,
        '&:hover .pill': { bgcolor: 'text.secondary', opacity: 0.5 },
    }}>
      <Box className="pill" sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'text.disabled', opacity: 0.2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: 2, minHeight: '100vh', width: '100vw', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
        <IconButton onClick={() => setSettingsOpen(true)} sx={{ bgcolor: 'background.paper' }}>
          <SettingsIcon />
        </IconButton>
      </Box>

      <ResponsiveGridLayout
        className="layout"
        layouts={getLayouts()}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 4, md: 4, sm: 2 }}
        rowHeight={120}
        draggableHandle=".drag-handle"
        margin={[16, 16]}
      >
        {showWidgetClock && (
          <Paper key="clock" sx={paperStyle}>
            <DragHandle />
            <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}><ClockWidget /></Box>
          </Paper>
        )}

        {showWidgetWeather && (
          <Paper key="weather" sx={paperStyle}>
            <DragHandle />
            <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}><WeatherWidget /></Box>
          </Paper>
        )}

        {showWidgetCalendar && (
          <Paper key="calendar" sx={paperStyle}>
            <DragHandle />
            <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <CalendarWidget onOpenSettings={() => setSettingsOpen(true)} />
            </Box>
          </Paper>
        )}
      </ResponsiveGridLayout>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
};

export default Dashboard;