import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

// Default Widgets configuration for a new page
const DEFAULT_WIDGET_CONFIG = {
  clock: true,
  weather: true,
  calendar: true,
  news: true,
  notes: false,
};

// Default Layout for a new page (Standard Grid)
const DEFAULT_PAGE_LAYOUT = {
  lg: [
    { i: 'clock', x: 0, y: 0, w: 6, h: 8 },
    { i: 'weather', x: 6, y: 0, w: 6, h: 8 },
    { i: 'news', x: 0, y: 8, w: 12, h: 3 }, 
    { i: 'calendar', x: 0, y: 11, w: 12, h: 14 },
  ],
  md: [ /* ... (Simplified for brevity, grid layout usually auto-generates if missing) ... */ ],
  sm: [ /* ... */ ]
};

export const SettingsProvider = ({ children }) => {
  // --- General ---
  const [themeMode, setThemeMode] = useLocalStorage('app_theme_mode', 'dark');
  const [effectiveTheme, setEffectiveTheme] = useState('dark');
  const [tutorialSeen, setTutorialSeen] = useLocalStorage('app_tutorial_seen_v1', false);

  // --- PAGE SYSTEM (The Brain) ---
  const [pages, setPages] = useLocalStorage('app_pages_v1', []); // Start empty to trigger migration
  const [activePageId, setActivePageId] = useLocalStorage('app_active_page_id', 'home');

  // --- Legacy Data (For Migration Only) ---
  const [oldLayouts] = useLocalStorage('dashboard_layouts_v7', null);
  const [oldShowClock] = useLocalStorage('app_show_clock', DEFAULT_WIDGET_CONFIG.clock);
  const [oldShowWeather] = useLocalStorage('app_show_weather', DEFAULT_WIDGET_CONFIG.weather);
  const [oldShowCalendar] = useLocalStorage('app_show_calendar', DEFAULT_WIDGET_CONFIG.calendar);
  const [oldShowNews] = useLocalStorage('app_show_news', DEFAULT_WIDGET_CONFIG.news);
  const [oldShowNotes] = useLocalStorage('app_show_notes', DEFAULT_WIDGET_CONFIG.notes);

  // --- Settings (Global) ---
  // These remain global across all pages
  const [timeFormat, setTimeFormat] = useLocalStorage('app_time_format', '12h');
  const [worldClock1, setWorldClock1] = useLocalStorage('app_wclock1', { show: false, city: 'London', zone: 'Europe/London' });
  const [worldClock2, setWorldClock2] = useLocalStorage('app_wclock2', { show: false, city: 'Tokyo', zone: 'Asia/Tokyo' });
  const [weatherLocation, setWeatherLocation] = useLocalStorage('app_weather_loc', { name: 'Baltimore', lat: 39.2904, lon: -76.6122 });
  const [weatherRefreshRate, setWeatherRefreshRate] = useLocalStorage('app_weather_refresh', 10);
  const [tempUnit, setTempUnit] = useLocalStorage('app_temp_unit', 'fahrenheit'); 
  const [showWeatherForecast, setShowWeatherForecast] = useLocalStorage('app_weather_forecast', false);
  const [showWeatherHighLow, setShowWeatherHighLow] = useLocalStorage('app_weather_highlow', true);
  const [showWeatherRainChance, setShowWeatherRainChance] = useLocalStorage('app_weather_rain', true);
  const [calendarUrl, setCalendarUrl] = useLocalStorage('app_calendar_url', '');
  const [calendarRefreshRate, setCalendarRefreshRate] = useLocalStorage('app_calendar_refresh', 60);
  const [notesDoc, setNotesDoc] = useLocalStorage('app_notes_doc', ""); 
  // NOTE: We moved to block structure for notes, keeping separate key to avoid conflict
  const [notesBlocks, setNotesBlocks] = useLocalStorage('app_notes_blocks_v2', [{ id: 'init', type: 'text', content: '' }]);
  const [notesTables, setNotesTables] = useLocalStorage('app_notes_tables', []);

  // --- MIGRATION LOGIC ---
  useEffect(() => {
    // If we have no pages, create the first one from existing data
    if (!pages || pages.length === 0) {
      console.log("Migrating to Page System...");
      
      const homePage = {
        id: 'home',
        name: 'Home',
        icon: 'Home',
        // Copy old visibility settings
        widgets: {
          clock: oldShowClock,
          weather: oldShowWeather,
          calendar: oldShowCalendar,
          news: oldShowNews,
          notes: oldShowNotes,
        },
        // Copy old layout (fallback to default if null)
        layouts: oldLayouts || DEFAULT_PAGE_LAYOUT
      };

      setPages([homePage]);
      setActivePageId('home');
    }
  }, []);

  // --- Theme Logic ---
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

  // --- PAGE MANAGERS ---
  
  // 1. Get the current active page object safely
  const activePage = pages.find(p => p.id === activePageId) || pages[0] || null;

  // 2. Add a new page
  const addPage = (name, icon) => {
    const newId = `page_${Date.now()}`;
    const newPage = {
      id: newId,
      name: name || 'New Page',
      icon: icon || 'Circle',
      widgets: { ...DEFAULT_WIDGET_CONFIG }, // Default enabled widgets
      layouts: { ...DEFAULT_PAGE_LAYOUT }    // Default positions
    };
    setPages([...pages, newPage]);
    setActivePageId(newId); // Switch to it
  };

  // 3. Update a page (rename, change icon, toggle widgets, update layout)
  const updatePage = (pageId, updates) => {
    setPages(prevPages => prevPages.map(p => 
      p.id === pageId ? { ...p, ...updates } : p
    ));
  };

  // 4. Delete a page
  const deletePage = (pageId) => {
    if (pages.length <= 1) return; // Prevent deleting last page
    const newPages = pages.filter(p => p.id !== pageId);
    setPages(newPages);
    if (activePageId === pageId) {
      setActivePageId(newPages[0].id); // Switch to first available
    }
  };

  const value = {
    themeMode, setThemeMode, effectiveTheme,
    tutorialSeen, setTutorialSeen,
    
    // PAGE SYSTEM EXPORTS
    pages, activePageId, setActivePageId, activePage,
    addPage, updatePage, deletePage,

    // Global Settings
    timeFormat, setTimeFormat,
    worldClock1, setWorldClock1,
    worldClock2, setWorldClock2,
    weatherLocation, setWeatherLocation,
    weatherRefreshRate, setWeatherRefreshRate,
    tempUnit, setTempUnit,
    showWeatherForecast, setShowWeatherForecast,
    showWeatherHighLow, setShowWeatherHighLow,
    showWeatherRainChance, setShowWeatherRainChance,
    calendarUrl, setCalendarUrl, 
    calendarRefreshRate, setCalendarRefreshRate,
    notesDoc, setNotesDoc, 
    notesBlocks, setNotesBlocks,
    notesTables, setNotesTables
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};