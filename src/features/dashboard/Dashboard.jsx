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
import { useSettings } from '../../context/SettingsContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- NEW FINE-GRAINED GRID DEFAULTS ---
// 12 Columns Total (vs 4 before).
// Row Height is smaller (30px vs 100px).
// This means "Width 6" = 50% screen. "Height 8" = approx 240px + gaps.
const defaultLayouts = {
  lg: [
    { i: 'clock', x: 0, y: 0, w: 6, h: 8 },      // Half width, ~260px height
    { i: 'weather', x: 6, y: 0, w: 6, h: 8 },    // Half width, ~260px height
    { i: 'calendar', x: 0, y: 8, w: 12, h: 14 }, // Full width, tall
  ],
  md: [
    { i: 'clock', x: 0, y: 0, w: 6, h: 8 },
    { i: 'weather', x: 6, y: 0, w: 6, h: 8 },
    { i: 'calendar', x: 0, y: 8, w: 12, h: 14 },
  ],
  sm: [
    { i: 'clock', x: 0, y: 0, w: 6, h: 8 },      // On mobile (6 cols), this is full width
    { i: 'weather', x: 0, y: 8, w: 6, h: 8 },
    { i: 'calendar', x: 0, y: 16, w: 6, h: 12 },
  ]
};

const Dashboard = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const theme = useTheme();
  
  // NOTE: Key changed to 'v2' to force reset for new grid system
  const [layouts, setLayouts] = useLocalStorage('dashboard_layouts_v2', defaultLayouts);
  const { showWidgetClock, showWidgetWeather, showWidgetCalendar } = useSettings();

  const getVisibleLayouts = () => {
    const visibleLayouts = {};
    Object.keys(layouts).forEach(breakpoint => {
      visibleLayouts[breakpoint] = layouts[breakpoint].filter(item => {
        if (item.i === 'clock' && !showWidgetClock) return false;
        if (item.i === 'weather' && !showWidgetWeather) return false;
        if (item.i === 'calendar' && !showWidgetCalendar) return false;
        return true;
      });
    });
    return visibleLayouts;
  };

  const handleLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(prevLayouts => {
      const newLayouts = { ...prevLayouts };
      Object.keys(allLayouts).forEach(breakpoint => {
         if (!newLayouts[breakpoint]) {
            newLayouts[breakpoint] = allLayouts[breakpoint];
            return;
         }
         newLayouts[breakpoint] = newLayouts[breakpoint].map(prevItem => {
            const updatedItem = allLayouts[breakpoint].find(u => u.i === prevItem.i);
            return updatedItem ? updatedItem : prevItem;
         });
      });
      return newLayouts;
    });
  };

  const paperStyle = {
    borderRadius: '28px',
    overflow: 'hidden',
    bgcolor: 'background.paper',
    display: 'flex', flexDirection: 'column', position: 'relative',
    height: '100%', // Important for grid filling
  };

  // --- VISUAL ELEMENTS ---
  
  // 1. Top Drag Pill (Moves the widget)
  const DragHandle = () => (
    <Box className="drag-handle" sx={{
        height: 24, width: '100%', cursor: 'grab', display: 'flex', justifyContent: 'center',
        paddingTop: 1, position: 'absolute', top: 0, left: 0, zIndex: 20,
        '&:active': { cursor: 'grabbing' }
    }}>
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'text.disabled', opacity: 0.2 }} />
    </Box>
  );

  // 2. Custom Resize Handle (Bottom Right Corner)
  // This overrides the default tiny handle with a nice large click target.
  const CustomResizeHandle = React.forwardRef((props, ref) => {
    const { handleAxis, ...restProps } = props;
    return (
      <Box
        ref={ref}
        className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
        {...restProps}
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '30px !important', // Large hit area
          height: '30px !important',
          cursor: 'se-resize',
          zIndex: 30,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '6px',
          opacity: 0.5,
          transition: 'opacity 0.2s',
          '&:hover': { opacity: 1 },
          // The visual corner graphic
          '&::after': {
            content: '""',
            width: '8px',
            height: '8px',
            borderRight: `3px solid ${theme.palette.text.secondary}`,
            borderBottom: `3px solid ${theme.palette.text.secondary}`,
            borderBottomRightRadius: '2px'
          }
        }}
      />
    );
  });

  return (
    <Box sx={{ p: 2, minHeight: '100vh', width: '100vw', bgcolor: 'background.default', color: 'text.primary' }}>
      
      {/* Settings Button */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
        <IconButton onClick={() => setSettingsOpen(true)} sx={{ bgcolor: 'background.paper' }}>
          <SettingsIcon />
        </IconButton>
      </Box>

      <ResponsiveGridLayout
        className="layout"
        layouts={getVisibleLayouts()}
        onLayoutChange={handleLayoutChange}
        // GRID CONFIGURATION
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 12, sm: 6 }} // 12 Columns = Finer horizontal control
        rowHeight={30}                   // 30px Rows = Finer vertical control
        margin={[16, 16]}
        draggableHandle=".drag-handle"
        resizeHandles={['se']} // Resize from South-East corner
        resizeHandle={<CustomResizeHandle />} // Inject our custom handle
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