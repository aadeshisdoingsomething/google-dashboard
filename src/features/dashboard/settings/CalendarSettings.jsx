import React, { useEffect, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { useSettings } from '../../../context/SettingsContext';

const CalendarSettings = ({ onUrlChange }) => {
  const { 
    calendarUrl, 
    calendarRefreshRate, setCalendarRefreshRate 
  } = useSettings();
  
  const [localUrl, setLocalUrl] = useState(calendarUrl);

  // Sync local state with global state updates if needed
  useEffect(() => {
    setLocalUrl(calendarUrl);
  }, [calendarUrl]);

  const handleChange = (e) => {
    setLocalUrl(e.target.value);
    onUrlChange(e.target.value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">Calendar</Typography>
      
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
        placeholder="<iframe src='...'>"
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
      />
    </Box>
  );
};

export default CalendarSettings;