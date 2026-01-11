import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Divider } from '@mui/material';
import { useSettings } from '../../context/SettingsContext';

// Import sub-components
import SearchOverlay from './settings/SearchOverlay';
import GeneralSettings from './settings/GeneralSettings';
import ClockSettings from './settings/ClockSettings';
import WeatherSettings from './settings/WeatherSettings';
import CalendarSettings from './settings/CalendarSettings';
import InstallAppSection from './settings/InstallAppSection'; // NEW IMPORT

const SettingsPanel = ({ open, onClose }) => {
  const settings = useSettings();
  
  // Local state for Calendar URL (to only save on "Save")
  const [tempCalUrl, setTempCalUrl] = useState(settings.calendarUrl);

  // --- Search Logic State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(null); // 'weather', 'clock1', 'clock2'

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
    // Cleanup
    setSearchResults([]);
    setSearchTerm('');
    setSearchMode(null);
  };

  const handleSave = () => {
    // Commit the calendar URL only on save
    settings.setCalendarUrl(tempCalUrl);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Dashboard Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          
          {/* 1. Search Overlay (Conditional) */}
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
          {/* Hide others when searching to keep UI clean */}
          {!searchMode && (
            <>
              {/* NEW: Install App Banner (Only shows if in browser) */}
              <InstallAppSection />
              
              <GeneralSettings />
              <Divider />
              <ClockSettings onSearchRequest={setSearchMode} />
              <Divider />
              <WeatherSettings onSearchRequest={setSearchMode} />
              <Divider />
              {/* Pass the setter for the temp URL */}
              <CalendarSettings onUrlChange={setTempCalUrl} />
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