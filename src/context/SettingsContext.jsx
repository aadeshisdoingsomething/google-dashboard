import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // --- General ---
  const [themeMode, setThemeMode] = useLocalStorage('app_theme_mode', 'dark');
  const [effectiveTheme, setEffectiveTheme] = useState('dark');
  const [tutorialSeen, setTutorialSeen] = useLocalStorage('app_tutorial_seen_v1', false);

  // --- Widget Visibility ---
  const [showWidgetClock, setShowWidgetClock] = useLocalStorage('app_show_clock', true);
  const [showWidgetWeather, setShowWidgetWeather] = useLocalStorage('app_show_weather', true);
  const [showWidgetCalendar, setShowWidgetCalendar] = useLocalStorage('app_show_calendar', true);
  const [showWidgetNews, setShowWidgetNews] = useLocalStorage('app_show_news', true);
  const [showWidgetNotes, setShowWidgetNotes] = useLocalStorage('app_show_notes', true);

  // --- Notes Data (NEW BLOCK STRUCTURE) ---
  // A list of objects: { id, type: 'text'|'table', content: ... }
  const [notesBlocks, setNotesBlocks] = useLocalStorage('app_notes_blocks_v2', [
    { id: 'init_text', type: 'text', content: "Kitchen Notes...\n\n- Buy vanilla\n- Check oven at 4pm" }
  ]);

  // --- Clock Settings ---
  const [timeFormat, setTimeFormat] = useLocalStorage('app_time_format', '12h');
  const [worldClock1, setWorldClock1] = useLocalStorage('app_wclock1', { show: false, city: 'London', zone: 'Europe/London' });
  const [worldClock2, setWorldClock2] = useLocalStorage('app_wclock2', { show: false, city: 'Tokyo', zone: 'Asia/Tokyo' });

  // --- Weather Settings ---
  const [weatherLocation, setWeatherLocation] = useLocalStorage('app_weather_loc', { name: 'Baltimore', lat: 39.2904, lon: -76.6122 });
  const [weatherRefreshRate, setWeatherRefreshRate] = useLocalStorage('app_weather_refresh', 10);
  const [tempUnit, setTempUnit] = useLocalStorage('app_temp_unit', 'fahrenheit'); 
  const [showWeatherForecast, setShowWeatherForecast] = useLocalStorage('app_weather_forecast', false);
  const [showWeatherHighLow, setShowWeatherHighLow] = useLocalStorage('app_weather_highlow', true);
  const [showWeatherRainChance, setShowWeatherRainChance] = useLocalStorage('app_weather_rain', true);

  // --- Calendar Settings ---
  const [calendarUrl, setCalendarUrl] = useLocalStorage('app_calendar_url', '');
  const [calendarRefreshRate, setCalendarRefreshRate] = useLocalStorage('app_calendar_refresh', 60);

  useEffect(() => {
    const calculateTheme = () => {
      if (themeMode === 'auto') {
        const hour = new Date().getHours();
        setEffectiveTheme(hour >= 6 && hour < 18 ? 'light' : 'dark');
      } else {
        setEffectiveTheme(themeMode);
      }
    };
    calculateTheme();
    const interval = setInterval(calculateTheme, 60 * 1000);
    return () => clearInterval(interval);
  }, [themeMode]);

  const value = {
    themeMode, setThemeMode, effectiveTheme,
    tutorialSeen, setTutorialSeen,
    // Visibility
    showWidgetClock, setShowWidgetClock,
    showWidgetWeather, setShowWidgetWeather,
    showWidgetCalendar, setShowWidgetCalendar,
    showWidgetNews, setShowWidgetNews,
    showWidgetNotes, setShowWidgetNotes,
    // Notes Data
    notesBlocks, setNotesBlocks, // New Block State
    // Clock
    timeFormat, setTimeFormat,
    worldClock1, setWorldClock1,
    worldClock2, setWorldClock2,
    // Weather
    weatherLocation, setWeatherLocation,
    weatherRefreshRate, setWeatherRefreshRate,
    tempUnit, setTempUnit,
    showWeatherForecast, setShowWeatherForecast,
    showWeatherHighLow, setShowWeatherHighLow,
    showWeatherRainChance, setShowWeatherRainChance,
    // Calendar
    calendarUrl, setCalendarUrl, 
    calendarRefreshRate, setCalendarRefreshRate,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};