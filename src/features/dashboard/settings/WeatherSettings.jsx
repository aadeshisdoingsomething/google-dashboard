import React from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Switch } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSettings } from '../../../context/SettingsContext';

const WeatherSettings = ({ onSearchRequest }) => {
  const { 
    weatherLocation, 
    tempUnit, setTempUnit,
    weatherRefreshRate, setWeatherRefreshRate,
    showWeatherForecast, setShowWeatherForecast,
    showWeatherHighLow, setShowWeatherHighLow,
    showWeatherRainChance, setShowWeatherRainChance
  } = useSettings();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
         <Typography variant="h6" color="primary">Weather</Typography>
         <Button size="small" variant="outlined" startIcon={<SearchIcon />} onClick={() => onSearchRequest('weather')}>
           {weatherLocation.name}
         </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
         <FormControl fullWidth size="small">
            <InputLabel>Unit</InputLabel>
            <Select value={tempUnit} label="Unit" onChange={(e) => setTempUnit(e.target.value)}>
              <MenuItem value="fahrenheit">°F</MenuItem>
              <MenuItem value="celsius">°C</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Refresh</InputLabel>
            <Select value={weatherRefreshRate} label="Refresh" onChange={(e) => setWeatherRefreshRate(e.target.value)}>
              <MenuItem value={10}>10m</MenuItem>
              <MenuItem value={60}>1h</MenuItem>
            </Select>
          </FormControl>
      </Box>
      <FormGroup row>
        <FormControlLabel control={<Switch checked={showWeatherForecast} onChange={(e) => setShowWeatherForecast(e.target.checked)} />} label="7-Day" />
        <FormControlLabel control={<Switch checked={showWeatherHighLow} onChange={(e) => setShowWeatherHighLow(e.target.checked)} />} label="Hi/Lo" />
        <FormControlLabel control={<Switch checked={showWeatherRainChance} onChange={(e) => setShowWeatherRainChance(e.target.checked)} />} label="Rain %" />
      </FormGroup>
    </Box>
  );
};

export default WeatherSettings;