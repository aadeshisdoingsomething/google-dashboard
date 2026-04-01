import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Alert, Stack, useTheme, Divider } from '@mui/material';
import { useSettings } from '../../../context/SettingsContext';

// --- Helpers ---
const getDayName = (dateStr) => {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getWeatherInfo = (code) => {
  const codes = {
    0: { desc: 'Clear Sky', icon: 'sunny' },
    1: { desc: 'Mostly Clear', icon: 'partly_cloudy_day' },
    2: { desc: 'Partly Cloudy', icon: 'partly_cloudy_day' },
    3: { desc: 'Overcast', icon: 'cloud' },
    45: { desc: 'Fog', icon: 'foggy' },
    48: { desc: 'Rime Fog', icon: 'foggy' },
    51: { desc: 'Light Drizzle', icon: 'rainy_light' },
    53: { desc: 'Moderate Drizzle', icon: 'rainy' },
    55: { desc: 'Dense Drizzle', icon: 'rainy' },
    56: { desc: 'Freezing Drizzle', icon: 'weather_snowy' },
    57: { desc: 'Dense Freezing Drizzle', icon: 'weather_snowy' },
    61: { desc: 'Light Rain', icon: 'rainy_light' },
    63: { desc: 'Moderate Rain', icon: 'rainy' },
    65: { desc: 'Heavy Rain', icon: 'rainy_heavy' },
    66: { desc: 'Light Freezing Rain', icon: 'weather_snowy' },
    67: { desc: 'Heavy Freezing Rain', icon: 'weather_snowy' },
    71: { desc: 'Light Snow', icon: 'weather_snowy' },
    73: { desc: 'Moderate Snow', icon: 'weather_snowy' },
    75: { desc: 'Heavy Snow', icon: 'weather_snowy' },
    77: { desc: 'Snow Grains', icon: 'weather_snowy' },
    80: { desc: 'Light Rain Showers', icon: 'rainy_light' },
    81: { desc: 'Moderate Rain Showers', icon: 'rainy' },
    82: { desc: 'Violent Rain Showers', icon: 'rainy_heavy' },
    85: { desc: 'Light Snow Showers', icon: 'weather_snowy' },
    86: { desc: 'Heavy Snow Showers', icon: 'weather_snowy' },
    95: { desc: 'Thunderstorm', icon: 'thunderstorm' },
    96: { desc: 'Storm & Hail', icon: 'thunderstorm' },
    99: { desc: 'Heavy Storm & Hail', icon: 'thunderstorm' },
  };
  return codes[code] || { desc: 'Unknown', icon: 'question_mark' };
};

const WeatherWidget = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerDims, setContainerDims] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  const {
    weatherRefreshRate, tempUnit, weatherLocation,
    showWeatherForecast, showWeatherHighLow, showWeatherRainChance
  } = useSettings();

  const theme = useTheme();

  // --- Resize Observer (Scales text based on container size) ---
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerDims({
            width: entry.contentRect.width,
            height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Dynamic Font Scaling
  const baseSize = containerDims.width > 0 
    ? Math.min(containerDims.width / 24, containerDims.height / 14) 
    : 16;

  // --- Data Fetching ---
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const unitParam = tempUnit === 'celsius' ? 'celsius' : 'fahrenheit';
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${weatherLocation.lat}&longitude=${weatherLocation.lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=${unitParam}&wind_speed_unit=ms&timezone=auto`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("API Error");
        setData(await res.json());
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, (weatherRefreshRate || 10) * 60 * 1000);
    return () => clearInterval(interval);
  }, [weatherRefreshRate, tempUnit, weatherLocation]);

  if (loading && !data) return <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>Unavailable</Alert>;
  if (!data) return null;

  const current = data.current;
  const daily = data.daily;
  const currentInfo = getWeatherInfo(current.weather_code);

  const iconStyle = { fontVariationSettings: "'FILL' 1, 'wght' 400", display: 'block' };

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        fontSize: `${baseSize}px`, // Base scaling unit
        p: '1em'
      }}
    >

      {/* ==============================
          LEFT SIDE: Current Weather
         ============================== */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        pr: '1em',
        borderRight: showWeatherForecast ? `1px solid ${theme.palette.divider}` : 'none'
      }}>
        
        {/* Location */}
        <Typography variant="overline" noWrap sx={{ 
          fontWeight: 700, 
          color: theme.palette.text.secondary, 
          lineHeight: 1, 
          letterSpacing: '0.05em',
          mb: '0.5em',
          fontSize: '0.8em',
          width: '100%',
          textAlign: 'center'
        }}>
          {weatherLocation.name}
        </Typography>

        {/* 
            Icon + Temp 
            Using a flex row with a gap keeps them tight together 
            regardless of the container width.
        */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '0.2em', // Tight gap
          mb: '0.2em'
        }}>
            <span 
                className="material-symbols-rounded" 
                style={{ 
                    ...iconStyle, 
                    fontSize: '4.5em', 
                    color: currentInfo.icon.includes('sunny') ? '#FDB813' : theme.palette.text.primary,
                }}
            >
                {currentInfo.icon}
            </span>
          
            <Typography sx={{ 
                fontFamily: '"Google Sans", sans-serif', 
                fontWeight: 400, 
                fontSize: '4em', // Scaled text
                lineHeight: 1
            }}>
               {Math.round(current.temperature_2m)}°
            </Typography>
        </Box>

        {/* Condition Text */}
        <Typography sx={{ 
            textTransform: 'capitalize', 
            fontWeight: 500, 
            color: 'text.secondary',
            fontSize: '1em',
            mb: '1.2em'
        }}>
          {currentInfo.desc}
        </Typography>

        {/* Pills: High/Low & Rain */}
        <Stack direction="row" spacing={'0.5em'} justifyContent="center" flexWrap="wrap">
            {showWeatherHighLow && (
              <Stack direction="row" alignItems="center" spacing={'0.2em'} sx={{ 
                  bgcolor: 'action.hover', 
                  px: '0.8em', py: '0.3em', 
                  borderRadius: '1em' 
              }}>
                 <span className="material-symbols-rounded" style={{ ...iconStyle, fontSize: '1.2em', color: theme.palette.primary.main }}>thermostat</span>
                 <Typography fontWeight="600" sx={{ fontSize: '0.75em' }}>
                    {Math.round(daily.temperature_2m_max[0])}° / {Math.round(daily.temperature_2m_min[0])}°
                 </Typography>
              </Stack>
            )}
            {showWeatherRainChance && (
              <Stack direction="row" alignItems="center" spacing={'0.2em'} sx={{ 
                  bgcolor: 'action.hover', 
                  px: '0.8em', py: '0.3em', 
                  borderRadius: '1em' 
              }}>
                 <span className="material-symbols-rounded" style={{ ...iconStyle, fontSize: '1.2em', color: theme.palette.info.main }}>water_drop</span>
                 <Typography fontWeight="600" sx={{ fontSize: '0.75em' }}>
                   {daily.precipitation_probability_max[0]}%
                 </Typography>
              </Stack>
            )}
        </Stack>
      </Box>


      {/* ==============================
          RIGHT SIDE: Forecast Table
         ============================== */}
      {showWeatherForecast && (
        <Box sx={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', 
            pl: '1em',
            height: '100%',
        }}>
            {/* 
               Grid Container
               - Col 1: Day (auto width, aligned left)
               - Col 2: Icon (1fr, centered)
               - Col 3: Temps (auto width, aligned right)
            */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto', // The Table Structure
                rowGap: '0.5em',
                columnGap: '1em',
                alignItems: 'center',
                width: '100%',
                // Add some padding if it feels too close to edges, but the gap handles internal spacing
                px: '0.5em' 
            }}>
              {daily.time.slice(1, 6).map((day, index) => { 
                const dayCode = daily.weather_code[index + 1];
                const info = getWeatherInfo(dayCode);
                const maxT = Math.round(daily.temperature_2m_max[index + 1]);
                const minT = Math.round(daily.temperature_2m_min[index + 1]);

                return (
                  <React.Fragment key={day}>
                    {/* Column 1: Day Name */}
                    <Typography sx={{ 
                        fontWeight: 700, 
                        color: theme.palette.text.secondary,
                        fontSize: '0.85em',
                        textAlign: 'left'
                    }}>
                      {getDayName(day).toUpperCase()}
                    </Typography>

                    {/* Column 2: Icon */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <span className="material-symbols-rounded" style={{ ...iconStyle, fontSize: '1.5em', color: theme.palette.text.primary }}>
                            {info.icon}
                        </span>
                    </Box>

                    {/* Column 3: Temperatures */}
                    <Stack direction="row" spacing={'0.3em'} alignItems="center" sx={{ justifyContent: 'flex-end' }}>
                        <Typography fontWeight="bold" sx={{ fontSize: '0.9em' }}>
                          {maxT}°
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '0.75em', opacity: 0.7 }}>
                          /
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '0.9em' }}>
                          {minT}°
                        </Typography>
                    </Stack>
                  </React.Fragment>
                );
              })}
            </Box>
        </Box>
      )}

    </Box>
  );
};

export default WeatherWidget;