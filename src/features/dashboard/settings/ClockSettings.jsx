import React from 'react';
import { Box, Typography, FormControlLabel, Switch, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSettings } from '../../../context/SettingsContext';

const ClockSettings = ({ onSearchRequest }) => {
  const { worldClock1, setWorldClock1, worldClock2, setWorldClock2 } = useSettings();

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">World Clocks</Typography>
      
      {/* Clock 1 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
         <FormControlLabel 
            control={<Switch checked={worldClock1.show} onChange={(e) => setWorldClock1(p => ({...p, show: e.target.checked}))} />} 
            label="World Clock 1" 
          />
          {worldClock1.show && (
            <Button size="small" variant="outlined" startIcon={<SearchIcon />} onClick={() => onSearchRequest('clock1')}>
              {worldClock1.city}
            </Button>
          )}
      </Box>

      {/* Clock 2 */}
       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
         <FormControlLabel 
            control={<Switch checked={worldClock2.show} onChange={(e) => setWorldClock2(p => ({...p, show: e.target.checked}))} />} 
            label="World Clock 2" 
          />
          {worldClock2.show && (
            <Button size="small" variant="outlined" startIcon={<SearchIcon />} onClick={() => onSearchRequest('clock2')}>
              {worldClock2.city}
            </Button>
          )}
      </Box>
    </Box>
  );
};

export default ClockSettings;