import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { useSettings } from '../../../context/SettingsContext';

const GeneralSettings = () => {
  const { 
    themeMode, setThemeMode, 
    timeFormat, setTimeFormat,
    showWidgetClock, setShowWidgetClock,
    showWidgetWeather, setShowWidgetWeather,
    showWidgetCalendar, setShowWidgetCalendar,
    showWidgetNews, setShowWidgetNews,
    showWidgetNotes, setShowWidgetNotes // New
  } = useSettings();

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">Visibility & Theme</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Theme</InputLabel>
          <Select value={themeMode} label="Theme" onChange={(e) => setThemeMode(e.target.value)}>
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="auto">Auto</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>Time Format</InputLabel>
          <Select value={timeFormat} label="Time Format" onChange={(e) => setTimeFormat(e.target.value)}>
            <MenuItem value="12h">12 Hour</MenuItem>
            <MenuItem value="24h">24 Hour</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <FormGroup row>
        <FormControlLabel control={<Switch checked={showWidgetClock} onChange={(e) => setShowWidgetClock(e.target.checked)} />} label="Clock" />
        <FormControlLabel control={<Switch checked={showWidgetWeather} onChange={(e) => setShowWidgetWeather(e.target.checked)} />} label="Weather" />
        <FormControlLabel control={<Switch checked={showWidgetNews} onChange={(e) => setShowWidgetNews(e.target.checked)} />} label="News" />
        <FormControlLabel control={<Switch checked={showWidgetNotes} onChange={(e) => setShowWidgetNotes(e.target.checked)} />} label="Notes" />
        <FormControlLabel control={<Switch checked={showWidgetCalendar} onChange={(e) => setShowWidgetCalendar(e.target.checked)} />} label="Calendar" />
      </FormGroup>
    </Box>
  );
};

export default GeneralSettings;