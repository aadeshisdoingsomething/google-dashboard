import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Divider, Typography } from '@mui/material';
import { useSettings } from '../../context/SettingsContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Import sub-components
import SearchOverlay from './settings/SearchOverlay';
import GeneralSettings from './settings/GeneralSettings';
import ClockSettings from './settings/ClockSettings';
import WeatherSettings from './settings/WeatherSettings';
import CalendarSettings from './settings/CalendarSettings';
import InstallAppSection from './settings/InstallAppSection';

const SettingsPanel = ({ open, onClose }) => {
  const settings = useSettings();
  const [tempCalUrl, setTempCalUrl] = useState(settings.calendarUrl);
  
  // --- Search Logic State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(null); 

  // --- Handlers ---
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

  const handleReplayTutorial = () => {
    settings.setTutorialSeen(false); // Reset state
    onClose(); // Close settings to see it
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Dashboard Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          
          {/* 1. Search Overlay */}
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

          {/* 2. Settings Modules */}
          {!searchMode && (
            <>
              <InstallAppSection />
              
              <GeneralSettings />
              
              {/* Tutorial Replay Button */}
              <Button 
                startIcon={<HelpOutlineIcon />} 
                onClick={handleReplayTutorial}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                Replay Welcome Tutorial
              </Button>

              <Divider />
              <ClockSettings onSearchRequest={setSearchMode} />
              <Divider />
              <WeatherSettings onSearchRequest={setSearchMode} />
              <Divider />
              <CalendarSettings onUrlChange={setTempCalUrl} />

              {/* Version Footer */}
              <Box sx={{ textAlign: 'center', mt: 2, opacity: 0.5 }}>
                <Typography variant="caption">Version: 0.9.0</Typography>
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