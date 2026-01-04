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
    0: { desc: 'Clear', icon: 'sunny' },
    1: { desc: 'Mostly Clear', icon: 'partly_cloudy_day' },
    2: { desc: 'Partly Cloudy', icon: 'partly_cloudy_day' },
    3: { desc: 'Overcast', icon: 'cloud' },
    45: { desc: 'Fog', icon: 'foggy' },
    48: { desc: 'Fog', icon: 'foggy' },
    51: { desc: 'Drizzle', icon: 'rainy_light' },
    53: { desc: 'Drizzle', icon: 'rainy' },
    55: { desc: 'Drizzle', icon: 'rainy' },
    61: { desc: 'Rain', icon: 'rainy' },
    63: { desc: 'Rain', icon: 'rainy' },
    65: { desc: 'Heavy Rain', icon: 'rainy_heavy' },
    71: { desc: 'Snow', icon: 'weather_snowy' },
    73: { desc: 'Snow', icon: 'weather_snowy' },
    75: { desc: 'Heavy Snow', icon: 'weather_snowy' },
    95: { desc: 'Storm', icon: 'thunderstorm' },
    96: { desc: 'Storm', icon: 'thunderstorm' },
    99: { desc: 'Heavy Storm', icon: 'thunderstorm' },
  };
  return codes[code] || { desc: 'Unknown', icon: 'question_mark' };
};

const WeatherWidget = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [widgetWidth, setWidgetWidth] = useState(0);
  const containerRef = useRef(null);
  
  const { 
    weatherRefreshRate, tempUnit, weatherLocation,
    showWeatherForecast, showWeatherHighLow, showWeatherRainChance 
  } = useSettings();
  
  const theme = useTheme();

  // --- Resize Observer ---
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidgetWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isWide = widgetWidth > 450; 

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
        width: '100%', height: '100%', 
        display: 'flex', 
        flexDirection: isWide ? 'row' : 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      
      {/* ==============================
          SECTION 1: MAIN TEMP (LEFT)
         ============================== */}
      <Box sx={{ 
        flex: isWide ? 1 : 'unset',
        width: '100%',
        height: isWide ? '100%' : 'auto',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: isWide ? 0 : 1
      }}>
        
        {/* Location Name */}
        <Typography variant="overline" sx={{ 
          fontWeight: 700, 
          color: theme.palette.text.secondary, 
          lineHeight: 1, 
          letterSpacing: '1px',
          mb: 0.5 
        }}>
          {weatherLocation.name}
        </Typography>

        {/* 
            Icon + Scaled Temp Wrapper 
        */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 0, // No gap, let the boxes handle spacing
          height: isWide ? '70%' : '110px',
        }}>
          
          {/* Icon Container - Increased Size */}
          <Box sx={{ 
            width: isWide ? '110px' : '90px', 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <span 
                className="material-symbols-rounded" 
                style={{ 
                    ...iconStyle, 
                    fontSize: isWide ? '100px' : '80px', // Larger Icon
                    color: currentInfo.icon.includes('sunny') ? '#FDB813' : theme.palette.text.primary,
                }}
            >
                {currentInfo.icon}
            </span>
          </Box>
          
          {/* SVG Temp - Tuned Viewbox */}
          <Box sx={{ 
            height: '100%', 
            width: isWide ? '180px' : '150px', // Wider container
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            {/* 
               viewBox="0 5 100 45": Crops the top empty space so font looks bigger
               y="60%": Pushes text down to align vertically with the icon center
            */}
            <svg width="100%" height="100%" viewBox="0 5 100 45" preserveAspectRatio="xMidYMid meet">
              <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" 
                fill={theme.palette.text.primary}
                style={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 400, fontSize: '55px' }} 
              >
                {Math.round(current.temperature_2m)}°
              </text>
            </svg>
          </Box>
        </Box>

        {/* Description */}
        <Typography variant="h6" color="text.secondary" sx={{ textTransform: 'capitalize', fontWeight: 500, mt: -0.5 }}>
          {currentInfo.desc}
        </Typography>
      </Box>


      {/* ==============================
          SECTION 2: DETAILS (RIGHT/BOTTOM)
         ============================== */}
      
      {isWide && <Divider orientation="vertical" flexItem sx={{ mx: 2, opacity: 0.5 }} />}

      <Box sx={{ 
        flex: isWide ? 1.2 : 'unset', 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        
        {/* High / Low / Rain */}
        {(showWeatherHighLow || showWeatherRainChance) && (
          <Stack direction="row" spacing={2} sx={{ mb: showWeatherForecast ? 2 : 0, mt: isWide ? 0 : 2 }}>
            {showWeatherHighLow && (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 4 }}>
                 <span className="material-symbols-rounded" style={{ ...iconStyle, fontSize: 18, color: theme.palette.primary.main }}>thermostat</span>
                 <Typography variant="body2" fontWeight="600">{Math.round(daily.temperature_2m_max[0])}° / {Math.round(daily.temperature_2m_min[0])}°</Typography>
              </Stack>
            )}
            {showWeatherRainChance && (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 4 }}>
                 <span className="material-symbols-rounded" style={{ ...iconStyle, fontSize: 18, color: theme.palette.primary.main }}>water_drop</span>
                 <Typography variant="body2" fontWeight="600">{daily.precipitation_probability_max[0]}%</Typography>
              </Stack>
            )}
          </Stack>
        )}

        {/* 5-Day Forecast */}
        {showWeatherForecast && (
          <Box sx={{ 
            width: '100%', 
            mt: isWide ? 3 : 2, 
            pt: isWide ? 0 : 2,
            borderTop: isWide ? 'none' : `1px solid ${theme.palette.divider}`,
            display: 'flex', 
            justifyContent: 'space-between' 
          }}>
            {daily.time.slice(1, 6).map((day, index) => { 
              const dayCode = daily.weather_code[index + 1];
              const info = getWeatherInfo(dayCode);
              return (
                <Box key={day} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 35 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '0.5px' }}>
                    {getDayName(day).toUpperCase()}
                  </Typography>
                  <span className="material-symbols-rounded" style={{ ...iconStyle, fontSize: 26, color: theme.palette.text.secondary }}>
                    {info.icon}
                  </span>
                  <Typography variant="caption" fontWeight="bold" sx={{ mt: 0.5 }}>
                    {Math.round(daily.temperature_2m_max[index + 1])}°
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

    </Box>
  );
};

export default WeatherWidget;