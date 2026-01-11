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

const ResponsiveGridLayout = WidthProvider(Responsive);

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
        width: '38px !important', 
        height: '38px !important',
        cursor: 'se-resize',
        zIndex: 38,
        touchAction: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '8px', 
        opacity: 0.6,
        transition: 'opacity 0.2s',
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
  const { activePage, pages, setActivePageId, updatePage } = useSettings();

  if (!activePage) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

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
    <Box sx={{ p: 2, minHeight: '100vh', width: '100vw', bgcolor: 'background.default', color: 'text.primary' }}>
      
      <TutorialDialog onOpenSettings={() => setSettingsOpen(true)} />

      <NavigationRail 
        pages={pages} 
        activePageId={activePage.id} 
        onSwitchPage={setActivePageId} 
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <Box sx={{ 
        marginLeft: '80px', 
        height: '100vh', 
        overflowY: 'auto', 
        overflowX: 'hidden',
        p: 2,
        transition: 'all 0.3s ease'
      }}>

        <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
          <IconButton onClick={() => setSettingsOpen(true)} sx={{ bgcolor: 'background.paper' }}>
            <SettingsIcon />
          </IconButton>
        </Box>

        <ResponsiveGridLayout
          className="layout"
          layouts={activePage.layouts || { lg: [], md: [], sm: [] }}
          onLayoutChange={handleLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 12, sm: 6 }}
          rowHeight={30}
          margin={[16, 16]}
          draggableHandle=".drag-handle"
          resizeHandles={['se']}
          resizeHandle={<CustomResizeHandle />}
        >
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