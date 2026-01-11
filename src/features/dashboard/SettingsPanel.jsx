import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Divider, 
  Typography, Collapse, Paper 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useSettings } from '../../context/SettingsContext';

// Components
import SearchOverlay from './settings/SearchOverlay';
import PageSettings from './settings/PageSettings';
import GeneralSettings from './settings/GeneralSettings';
import InstallAppSection from './settings/InstallAppSection';

// Widget Settings
import ClockSettings from './settings/ClockSettings';
import WeatherSettings from './settings/WeatherSettings';
import CalendarSettings from './settings/CalendarSettings';

// Clean Expandable Item Component
// FIX: Changed borderRadius from 3 to '16px' to prevent Pill shape
const SettingItem = ({ title, children, isOpen, onToggle }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      border: '1px solid', 
      borderColor: 'divider', 
      borderRadius: '16px', // FIXED
      overflow: 'hidden', 
      mb: 1 
    }}
  >
    <Box 
      onClick={onToggle}
      sx={{ 
        p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        cursor: 'pointer', bgcolor: isOpen ? 'action.hover' : 'transparent',
        transition: '0.2s'
      }}
    >
      <Typography fontWeight={600}>{title}</Typography>
      <ExpandMoreIcon sx={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
    </Box>
    <Collapse in={isOpen}>
      <Box sx={{ p: 2, pt: 0 }}>
        <Divider sx={{ mb: 2 }} />
        {children}
      </Box>
    </Collapse>
  </Paper>
);

const SettingsPanel = ({ open, onClose }) => {
  const settings = useSettings();
  const [tempCalUrl, setTempCalUrl] = useState(settings.calendarUrl);
  
  // Search Logic
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(null); 
  
  // UI State for expanded sections
  const [expandedSection, setExpandedSection] = useState(null);

  const handleToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchTerm}&count=5&language=en&format=json`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc) => {
    if (searchMode === 'weather') {
      settings.setWeatherLocation({ name: loc.name, lat: loc.latitude, lon: loc.longitude });
    } else if (searchMode === 'clock1') {
      settings.setWorldClock1(prev => ({ ...prev, city: loc.name, zone: loc.timezone }));
    } else if (searchMode === 'clock2') {
      settings.setWorldClock2(prev => ({ ...prev, city: loc.name, zone: loc.timezone }));
    }
    setSearchResults([]);
    setSearchTerm('');
    setSearchMode(null);
  };

  const handleSave = () => {
    settings.setCalendarUrl(tempCalUrl);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Dashboard Settings</DialogTitle>
      
      <DialogContent sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          
          <SearchOverlay 
            mode={searchMode}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearch}
            isSearching={isSearching}
            results={searchResults}
            onSelect={handleSelectLocation}
            onCancel={() => setSearchMode(null)}
          />

          {!searchMode && (
            <>
              <InstallAppSection />
              
              <PageSettings />
              
              <Divider />
              
              <GeneralSettings onReplayTutorial={() => { settings.setTutorialSeen(false); onClose(); }} />

              <Box>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>Widget Configuration</Typography>
                
                <SettingItem 
                  title="Weather" 
                  isOpen={expandedSection === 'weather'} 
                  onToggle={() => handleToggle('weather')}
                >
                  <WeatherSettings onSearchRequest={setSearchMode} />
                </SettingItem>

                <SettingItem 
                  title="World Clocks" 
                  isOpen={expandedSection === 'clocks'} 
                  onToggle={() => handleToggle('clocks')}
                >
                  <ClockSettings onSearchRequest={setSearchMode} />
                </SettingItem>

                <SettingItem 
                  title="Google Calendar" 
                  isOpen={expandedSection === 'calendar'} 
                  onToggle={() => handleToggle('calendar')}
                >
                  <CalendarSettings onUrlChange={setTempCalUrl} />
                </SettingItem>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2, opacity: 0.5 }}>
                <Typography variant="caption">Version: 0.9.5</Typography>
              </Box>
            </>
          )}

        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained" disableElevation>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsPanel;