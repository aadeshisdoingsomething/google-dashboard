import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Box, Paper, IconButton, useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Widgets
import ClockWidget from './widgets/ClockWidget';
import WeatherWidget from './widgets/WeatherWidget';
import CalendarWidget from './widgets/CalendarWidget';
import NewsWidget from './widgets/NewsWidget';
import NotesWidget from './widgets/NotesWidget';

// Components
import SettingsPanel from './SettingsPanel';
import TutorialDialog from './TutorialDialog';

// Hooks & Context
import { useSettings } from '../../context/SettingsContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- DEFAULT LAYOUTS ---
const defaultLayouts = {
  lg: [
    // Left Column
    { i: 'news', x: 0, y: 0, w: 6, h: 3 }, 
    { i: 'clock', x: 0, y: 3, w: 6, h: 7 },
    { i: 'weather', x: 0, y: 10, w: 6, h: 8 },
    
    // Right Column (Calendar shortened as requested)
    { i: 'calendar', x: 6, y: 0, w: 6, h: 11 },
    
    // Bottom Full Width
    { i: 'notes', x: 0, y: 18, w: 6, h: 7 },
  ],
  md: [
    { i: 'clock', x: 0, y: 0, w: 6, h: 8 },
    { i: 'weather', x: 6, y: 0, w: 6, h: 8 },
    { i: 'calendar', x: 0, y: 8, w: 12, h: 14 },
    { i: 'news', x: 0, y: 22, w: 12, h: 3 },
    { i: 'notes', x: 0, y: 25, w: 12, h: 10 },
  ],
  sm: [
    { i: 'clock', x: 0, y: 0, w: 6, h: 8 },
    { i: 'weather', x: 0, y: 8, w: 6, h: 8 },
    { i: 'news', x: 0, y: 16, w: 6, h: 3 }, 
    { i: 'calendar', x: 0, y: 19, w: 6, h: 12 },
    { i: 'notes', x: 0, y: 31, w: 6, h: 10 },
  ]
};

// --- OPTIMIZED RESIZE HANDLE ---
// Defined outside component to prevent re-mounting issues
const CustomResizeHandle = React.forwardRef((props, ref) => {
  const { handleAxis, ...restProps } = props;
  const theme = useTheme();

  return (
    <Box
      ref={ref}
      className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
      {...restProps}
      sx={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        // Large touch target for mobile
        width: '50px !important', 
        height: '50px !important',
        cursor: 'se-resize',
        zIndex: 50,
        touchAction: 'none', // Prevents scrolling on mobile while resizing
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '8px', 
        opacity: 0.6,
        transition: 'opacity 0.2s',
        // Visual corner indicator
        '&::after': {
          content: '""',
          width: '12px',
          height: '12px',
          borderRight: `4px solid ${theme.palette.text.secondary}`,
          borderBottom: `4px solid ${theme.palette.text.secondary}`,
          borderBottomRightRadius: '4px'
        },
        '&:hover': { opacity: 1 },
        '&:active': { opacity: 1, '&::after': { borderColor: theme.palette.primary.main } }
      }}
    />
  );
});

const Dashboard = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // NOTE: Key changed to 'v7' to apply your new calendar layout
  const [layouts, setLayouts] = useLocalStorage('dashboard_layouts_v7', defaultLayouts);
  
  const { 
    showWidgetClock, showWidgetWeather, 
    showWidgetCalendar, showWidgetNews, 
    showWidgetNotes 
  } = useSettings();

  const getVisibleLayouts = () => {
    const visibleLayouts = {};
    Object.keys(layouts).forEach(breakpoint => {
      visibleLayouts[breakpoint] = layouts[breakpoint].filter(item => {
        if (item.i === 'clock' && !showWidgetClock) return false;
        if (item.i === 'weather' && !showWidgetWeather) return false;
        if (item.i === 'calendar' && !showWidgetCalendar) return false;
        if (item.i === 'news' && !showWidgetNews) return false;
        if (item.i === 'notes' && !showWidgetNotes) return false;
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
    height: '100%',
  };

  const DragHandle = () => (
    <Box className="drag-handle" sx={{
        height: 30, width: '100%', cursor: 'grab', display: 'flex', justifyContent: 'center',
        paddingTop: 1.5, position: 'absolute', top: 0, left: 0, zIndex: 20,
        '&:active': { cursor: 'grabbing' }
    }}>
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'text.disabled', opacity: 0.2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: 2, minHeight: '100vh', width: '100vw', bgcolor: 'background.default', color: 'text.primary' }}>
      
      {/* GLOBAL TUTORIAL */}
      <TutorialDialog />

      {/* SETTINGS BUTTON */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
        <IconButton onClick={() => setSettingsOpen(true)} sx={{ bgcolor: 'background.paper' }}>
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* GRID LAYOUT */}
      <ResponsiveGridLayout
        className="layout"
        layouts={getVisibleLayouts()}
        onLayoutChange={handleLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 12, sm: 6 }}
        rowHeight={30}
        margin={[16, 16]}
        draggableHandle=".drag-handle"
        resizeHandles={['se']}
        resizeHandle={<CustomResizeHandle />}
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
        
        {showWidgetNews && (
          <Paper key="news" sx={paperStyle}>
            <DragHandle />
            <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <NewsWidget />
            </Box>
          </Paper>
        )}

        {showWidgetNotes && (
          <Paper key="notes" sx={paperStyle}>
            <DragHandle />
            <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <NotesWidget />
            </Box>
          </Paper>
        )}

      </ResponsiveGridLayout>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
};

export default Dashboard;