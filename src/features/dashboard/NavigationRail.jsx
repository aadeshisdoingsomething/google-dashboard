import React from 'react';
import { Box, IconButton, Tooltip, useTheme, Fade } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

// Icons for Pages
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';

// Map string IDs to actual Icon Components
export const PAGE_ICONS = {
  Home: <HomeRoundedIcon />,
  Work: <WorkRoundedIcon />,
  Calendar: <CalendarMonthRoundedIcon />,
  School: <SchoolRoundedIcon />,
  Star: <StarRoundedIcon />,
  Person: <PersonRoundedIcon />,
  Game: <SportsEsportsRoundedIcon />,
  General: <WidgetsRoundedIcon />,
};

const NavigationRail = ({ pages, activePageId, onSwitchPage, onOpenSettings }) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      width: 80, // Fixed width
      bgcolor: 'background.paper',
      borderRight: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 3, gap: 2,
      zIndex: 1200 // Above dashboard content
    }}>
      
      {/* --- PAGE LIST --- */}
      {pages.map((page) => {
        const isActive = page.id === activePageId;
        const Icon = PAGE_ICONS[page.icon] || PAGE_ICONS.General;

        return (
          <Tooltip key={page.id} title={page.name} placement="right">
            <Box 
              onClick={() => onSwitchPage(page.id)}
              sx={{
                width: 56, height: 32,
                borderRadius: 16, // Pill shape
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                // Active State Styling (M3 Pill)
                bgcolor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? 'primary.contrastText' : 'text.secondary',
                '&:hover': { 
                  bgcolor: isActive ? 'primary.main' : 'action.hover',
                  color: isActive ? 'primary.contrastText' : 'text.primary'
                }
              }}
            >
              {/* Clone icon to enforce size */}
              {React.cloneElement(Icon, { fontSize: 'small' })}
            </Box>
          </Tooltip>
        );
      })}

      {/* Spacer to push Settings to bottom */}
      <Box sx={{ flex: 1 }} />

      {/* --- SETTINGS BUTTON --- */}
      <Tooltip title="Settings" placement="right">
        <IconButton 
          onClick={onOpenSettings}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { color: 'text.primary', bgcolor: 'action.hover' }
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

    </Box>
  );
};

export default NavigationRail;