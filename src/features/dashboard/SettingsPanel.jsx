import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Select, MenuItem, FormControl, 
  InputLabel, Box, Typography, Divider, Switch, FormControlLabel, 
  FormGroup, IconButton, List, ListItem, ListItemText, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSettings } from '../../context/SettingsContext';

const SettingsPanel = ({ open, onClose }) => {
  const settings = useSettings();
  
  // Local state for Calendar URL input
  const [localCalUrl, setLocalCalUrl] = useState(settings.calendarUrl);

  // --- Search Logic (Used for Weather & World Clocks) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  // 'weather', 'clock1', 'clock2'
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
    // Reset search
    setSearchResults([]);
    setSearchTerm('');
    setSearchMode(null);
  };

  const handleSave = () => {
    settings.setCalendarUrl(localCalUrl);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Dashboard Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          
          {/* --- SEARCH OVERLAY (Shows if searching) --- */}
          {searchMode && (
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Searching for {searchMode === 'weather' ? 'Weather Location' : 'World Clock City'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField 
                  fullWidth size="small" placeholder="Enter city name..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <IconButton onClick={handleSearch} disabled={isSearching}><SearchIcon /></IconButton>
              </Box>
              {isSearching && <CircularProgress size={20} sx={{ mt: 2 }} />}
              <List dense>
                {searchResults.map((loc) => (
                  <ListItem button key={loc.id} onClick={() => handleSelectLocation(loc)}>
                    <ListItemText primary={loc.name} secondary={`${loc.country} (${loc.timezone})`} />
                  </ListItem>
                ))}
              </List>
              <Button size="small" onClick={() => setSearchMode(null)}>Cancel</Button>
            </Box>
          )}

          {/* --- GENERAL / VISIBILITY --- */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">Visibility & Theme</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Theme</InputLabel>
                <Select value={settings.themeMode} label="Theme" onChange={(e) => settings.setThemeMode(e.target.value)}>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>
               <FormControl fullWidth size="small">
                <InputLabel>Time Format</InputLabel>
                <Select value={settings.timeFormat} label="Time Format" onChange={(e) => settings.setTimeFormat(e.target.value)}>
                  <MenuItem value="12h">12 Hour</MenuItem>
                  <MenuItem value="24h">24 Hour</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <FormGroup row>
              <FormControlLabel control={<Switch checked={settings.showWidgetClock} onChange={(e) => settings.setShowWidgetClock(e.target.checked)} />} label="Clock" />
              <FormControlLabel control={<Switch checked={settings.showWidgetWeather} onChange={(e) => settings.setShowWidgetWeather(e.target.checked)} />} label="Weather" />
              <FormControlLabel control={<Switch checked={settings.showWidgetCalendar} onChange={(e) => settings.setShowWidgetCalendar(e.target.checked)} />} label="Calendar" />
            </FormGroup>
          </Box>

          <Divider />

          {/* --- CLOCK SETTINGS --- */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">World Clocks</Typography>
            
            {/* Clock 1 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
               <FormControlLabel 
                  control={<Switch checked={settings.worldClock1.show} onChange={(e) => settings.setWorldClock1(p => ({...p, show: e.target.checked}))} />} 
                  label="World Clock 1" 
                />
                {settings.worldClock1.show && (
                  <Button size="small" variant="outlined" startIcon={<SearchIcon />} onClick={() => setSearchMode('clock1')}>
                    {settings.worldClock1.city}
                  </Button>
                )}
            </Box>

            {/* Clock 2 */}
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <FormControlLabel 
                  control={<Switch checked={settings.worldClock2.show} onChange={(e) => settings.setWorldClock2(p => ({...p, show: e.target.checked}))} />} 
                  label="World Clock 2" 
                />
                {settings.worldClock2.show && (
                  <Button size="small" variant="outlined" startIcon={<SearchIcon />} onClick={() => setSearchMode('clock2')}>
                    {settings.worldClock2.city}
                  </Button>
                )}
            </Box>
          </Box>

          <Divider />

          {/* --- WEATHER SETTINGS --- */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
               <Typography variant="h6" color="primary">Weather</Typography>
               <Button size="small" variant="outlined" startIcon={<SearchIcon />} onClick={() => setSearchMode('weather')}>
                 {settings.weatherLocation.name}
               </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
               <FormControl fullWidth size="small">
                  <InputLabel>Unit</InputLabel>
                  <Select value={settings.tempUnit} label="Unit" onChange={(e) => settings.setTempUnit(e.target.value)}>
                    <MenuItem value="fahrenheit">°F</MenuItem>
                    <MenuItem value="celsius">°C</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Refresh</InputLabel>
                  <Select value={settings.weatherRefreshRate} label="Refresh" onChange={(e) => settings.setWeatherRefreshRate(e.target.value)}>
                    <MenuItem value={10}>10m</MenuItem>
                    <MenuItem value={60}>1h</MenuItem>
                  </Select>
                </FormControl>
            </Box>
            <FormGroup row>
              <FormControlLabel control={<Switch checked={settings.showWeatherForecast} onChange={(e) => settings.setShowWeatherForecast(e.target.checked)} />} label="7-Day" />
              <FormControlLabel control={<Switch checked={settings.showWeatherHighLow} onChange={(e) => settings.setShowWeatherHighLow(e.target.checked)} />} label="Hi/Lo" />
              <FormControlLabel control={<Switch checked={settings.showWeatherRainChance} onChange={(e) => settings.setShowWeatherRainChance(e.target.checked)} />} label="Rain %" />
            </FormGroup>
          </Box>

          <Divider />

          {/* --- CALENDAR SETTINGS --- */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">Calendar</Typography>
            
            {/* RESTORED REFRESH RATE CONTROL */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Auto Refresh</InputLabel>
                <Select value={settings.calendarRefreshRate} label="Auto Refresh" onChange={(e) => settings.setCalendarRefreshRate(e.target.value)}>
                  <MenuItem value={15}>15 mins</MenuItem>
                  <MenuItem value={30}>30 mins</MenuItem>
                  <MenuItem value={60}>1 Hour</MenuItem>
                  <MenuItem value={0}>Disable</MenuItem>
                </Select>
              </FormControl>

            <TextField
              label="Google Calendar Embed URL"
              fullWidth multiline rows={2}
              value={localCalUrl} onChange={(e) => setLocalCalUrl(e.target.value)}
              variant="outlined"
              placeholder="<iframe src='...'>"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
          </Box>

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