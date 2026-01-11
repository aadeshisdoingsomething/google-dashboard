import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Divider, 
  Typography, Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const SettingsPanel = ({ open, onClose }) => {
  const settings = useSettings();
  const [tempCalUrl, setTempCalUrl] = useState(settings.calendarUrl);
  
  // Search Logic
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(null); 

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
    settings.setTutorialSeen(false); 
    onClose(); 
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Dashboard Settings</DialogTitle>
      
      <DialogContent sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          
          {/* SEARCH OVERLAY */}
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
              {/* 1. APP CONFIG (Pages & Theme) */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <InstallAppSection />
                <PageSettings />
                <GeneralSettings onReplayTutorial={handleReplayTutorial} />
              </Box>

              <Divider />

              {/* 2. SPECIFIC WIDGET CONFIGURATION (Accordions) */}
              <Box>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>Widget Configuration</Typography>
                
                <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 1, overflow: 'hidden' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600}>Weather</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <WeatherSettings onSearchRequest={setSearchMode} />
                  </AccordionDetails>
                </Accordion>

                <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 1, overflow: 'hidden' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600}>World Clocks</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ClockSettings onSearchRequest={setSearchMode} />
                  </AccordionDetails>
                </Accordion>

                <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 1, overflow: 'hidden' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600}>Google Calendar</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <CalendarSettings onUrlChange={setTempCalUrl} />
                  </AccordionDetails>
                </Accordion>
              </Box>

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