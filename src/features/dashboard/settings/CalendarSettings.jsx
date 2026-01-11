import React, { useEffect, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, IconButton, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSettings } from '../../../context/SettingsContext';
import CalendarHelpDialog from './CalendarHelpDialog';

const CalendarSettings = ({ onUrlChange }) => {
  const { 
    calendarUrl, 
    calendarRefreshRate, setCalendarRefreshRate 
  } = useSettings();
  
  const [localUrl, setLocalUrl] = useState(calendarUrl);
  const [helpOpen, setHelpOpen] = useState(false);

  // Sync local state
  useEffect(() => {
    setLocalUrl(calendarUrl);
  }, [calendarUrl]);

  const handleChange = (e) => {
    let value = e.target.value;
    
    // SMART PASTE: If user pastes the full <iframe> code, extract the src
    if (value.includes('<iframe') && value.includes('src="')) {
      const srcMatch = value.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        value = srcMatch[1];
      }
    }

    setLocalUrl(value);
    onUrlChange(value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" color="primary">Calendar</Typography>
        <Tooltip title="Setup Instructions">
          <IconButton size="small" onClick={() => setHelpOpen(true)} color="primary">
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Auto Refresh</InputLabel>
          <Select value={calendarRefreshRate} label="Auto Refresh" onChange={(e) => setCalendarRefreshRate(e.target.value)}>
            <MenuItem value={15}>15 mins</MenuItem>
            <MenuItem value={30}>30 mins</MenuItem>
            <MenuItem value={60}>1 Hour</MenuItem>
            <MenuItem value={0}>Disable</MenuItem>
          </Select>
        </FormControl>

      <TextField
        label="Google Calendar Embed URL"
        fullWidth multiline rows={2}
        value={localUrl} 
        onChange={handleChange}
        variant="outlined"
        placeholder="Paste 'Embed code' here..."
        helperText={localUrl.startsWith('<iframe') ? "Full iframe tag detected (will be cleaned on save)" : ""}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
      />

      <CalendarHelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </Box>
  );
};

export default CalendarSettings;