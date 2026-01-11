import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Box, Paper, IconButton, useTheme, CircularProgress } from '@mui/material';
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
import NavigationRail from './NavigationRail';

// Hooks & Context
import { useSettings } from '../../context/SettingsContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- DEFAULT LAYOUTS ---
// (Used for migration/reset only now)
const defaultLayouts = {
  lg: [
    { i: 'news', x: 0, y: 0, w: 6, h: 3 }, 
    { i: 'clock', x: 0, y: 3, w: 6, h: 7 },
    { i: 'weather', x: 0, y: 10, w: 6, h: 8 },
    { i: 'calendar', x: 6, y: 0, w: 6, h: 11 },
    { i: 'notes', x: 0, y: 18, w: 12, h: 10 },
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
const CustomResizeHandle = React.forwardRef((props, ref) => {
  const { handleAxis, ...restProps } = props;
  const theme = useTheme();

  return (
    <Box
      ref={ref}
      className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
      {...restProps}
      sx={{
        position: 'absolute', bottom: 0, right: 0,
        width: '50px !important', height: '50px !important',
        cursor: 'se-resize', zIndex: 50,
        touchAction: 'none', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
        padding: '8px', opacity: 0.6, transition: 'opacity 0.2s',
        '&::after': {
          content: '""', width: '12px', height: '12px',
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
  
  // NOTE: Ensure key matches your Context migration logic if needed, 
  // but Dashboard doesn't manage global layouts anymore, it reads from activePage.
  // We keep this here just in case you haven't fully migrated Context yet, 
  // but the code below uses 'activePage.layouts'.
  
  // Get Page Data from Context
  const { 
    activePage, 
    pages, 
    setActivePageId, // FIX: Corrected name (was setActivePage)
    updatePage 
  } = useSettings();

  // Safety Check
  if (!activePage) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle Layout Changes
  const handleLayoutChange = (currentLayout, allLayouts) => {
    updatePage(activePage.id, { layouts: allLayouts });
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
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'background.default', color: 'text.primary' }}>
      
      {/* 1. Navigation Rail (Left) */}
      <NavigationRail 
        pages={pages} 
        activePageId={activePage.id} 
        onSwitchPage={setActivePageId} // FIX: Pass the corrected function
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* 2. Main Canvas (Shifted Right) */}
      <Box sx={{ 
        marginLeft: '80px', // Space for Rail
        height: '100vh', 
        overflowY: 'auto', 
        overflowX: 'hidden',
        p: 2,
        transition: 'all 0.3s ease'
      }}>
        
        {/* GLOBAL TUTORIAL */}
        <TutorialDialog />

        <ResponsiveGridLayout
          className="layout"
          layouts={activePage.layouts} // READ from Page
          onLayoutChange={handleLayoutChange} // WRITE to Page
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 12, sm: 6 }}
          rowHeight={30}
          margin={[16, 16]}
          draggableHandle=".drag-handle"
          resizeHandles={['se']}
          resizeHandle={<CustomResizeHandle />}
        >
          {/* WIDGETS: Check activePage.widgets.[name] */}

          {activePage.widgets.clock && (
            <Paper key="clock" sx={paperStyle}>
              <DragHandle />
              <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}><ClockWidget /></Box>
            </Paper>
          )}

          {activePage.widgets.weather && (
            <Paper key="weather" sx={paperStyle}>
              <DragHandle />
              <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}><WeatherWidget /></Box>
            </Paper>
          )}

          {activePage.widgets.news && (
            <Paper key="news" sx={paperStyle}>
              <DragHandle />
              <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <NewsWidget />
              </Box>
            </Paper>
          )}

          {activePage.widgets.calendar && (
            <Paper key="calendar" sx={paperStyle}>
              <DragHandle />
              <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <CalendarWidget onOpenSettings={() => setSettingsOpen(true)} />
              </Box>
            </Paper>
          )}
          
          {activePage.widgets.notes && (
            <Paper key="notes" sx={paperStyle}>
              <DragHandle />
              <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <NotesWidget />
              </Box>
            </Paper>
          )}

        </ResponsiveGridLayout>
      </Box>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
};

export default Dashboard;