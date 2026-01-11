import React from 'react';
// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';

// 1. The "Nice" Grid for new pages
export const INITIAL_LAYOUTS = {
  lg: [
    { i: 'clock', x: 0, y: 0, w: 6, h: 8 },
    { i: 'weather', x: 6, y: 0, w: 6, h: 8 },
    { i: 'calendar', x: 0, y: 8, w: 12, h: 14 },
    { i: 'news', x: 0, y: 22, w: 12, h: 3 },
    { i: 'notes', x: 0, y: 25, w: 12, h: 10 },
  ],
  md: [
    { i: 'clock', x: 0, y: 0, w: 6, h: 8 },
    { i: 'weather', x: 6, y: 0, w: 6, h: 8 },
    { i: 'calendar', x: 0, y: 8, w: 12, h: 14 },
    { i: 'news', x: 0, y: 22, w: 12, h: 3 },
    { i: 'notes', x: 0, y: 25, w: 12, h: 10 },
  ],
  sm: [
    { i: 'clock', x: 0, y: 0, w: 6, h: 8 },
    { i: 'weather', x: 0, y: 8, w: 6, h: 8 },
    { i: 'calendar', x: 0, y: 16, w: 6, h: 12 },
    { i: 'news', x: 0, y: 28, w: 6, h: 3 },
    { i: 'notes', x: 0, y: 31, w: 6, h: 10 },
  ]
};

// 2. Default Widgets enabled for new pages
export const INITIAL_WIDGETS = {
  clock: true,
  weather: true,
  calendar: true,
  news: true,
  notes: true
};

// 3. Default dimensions (Used when toggling a widget ON later)
export const WIDGET_DEFAULTS = {
  clock:    { w: 6, h: 8, minW: 3, minH: 4 },
  weather:  { w: 6, h: 8, minW: 3, minH: 4 },
  news:     { w: 12, h: 3, minW: 6, minH: 3 },
  calendar: { w: 6, h: 12, minW: 4, minH: 6 },
  notes:    { w: 6, h: 8, minW: 3, minH: 4 }
};

// 4. Icon Selection
export const ICONS = [
  { id: 'Home', icon: <HomeRoundedIcon /> },
  { id: 'Work', icon: <WorkRoundedIcon /> },
  { id: 'Calendar', icon: <CalendarMonthRoundedIcon /> },
  { id: 'School', icon: <SchoolRoundedIcon /> },
  { id: 'Star', icon: <StarRoundedIcon /> },
  { id: 'Person', icon: <PersonRoundedIcon /> },
  { id: 'Game', icon: <SportsEsportsRoundedIcon /> },
  { id: 'General', icon: <WidgetsRoundedIcon /> },
];