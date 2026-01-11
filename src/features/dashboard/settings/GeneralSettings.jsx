import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useSettings } from '../../../context/SettingsContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const GeneralSettings = ({ onReplayTutorial }) => {
  const { themeMode, setThemeMode, timeFormat, setTimeFormat } = useSettings();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle2" color="primary" fontWeight={700}>
        Global Appearance
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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

      <Button 
        startIcon={<HelpOutlineIcon />} 
        onClick={onReplayTutorial}
        size="small"
        sx={{ justifyContent: 'flex-start', textTransform: 'none', color: 'text.secondary' }}
      >
        Replay Welcome Tutorial
      </Button>
    </Box>
  );
};

export default GeneralSettings;