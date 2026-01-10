import React from 'react';
import { Box, IconButton, Fade, useTheme, ButtonBase } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { STATIONS } from '../../services/stations';

const SourcePicker = ({ open, onClose, currentId, onSelect }) => {
  const theme = useTheme();

  return (
    <Fade in={open}>
      <Box sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: theme.palette.background.paper, 
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 2
      }}>
        {/* Close Button */}
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'action.hover' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>

        {/* Horizontal Scroll List */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          overflowX: 'auto', 
          width: '100%',
          pb: 0.5, 
          '&::-webkit-scrollbar': { display: 'none' } 
        }}>
          {STATIONS.map((station) => {
            const isActive = currentId === station.id;
            return (
              <ButtonBase
                key={station.id}
                onClick={() => onSelect(station.id)}
                sx={{
                  px: 2, py: 1,
                  borderRadius: 4,
                  // Use Theme Primary color for active state
                  bgcolor: isActive ? theme.palette.primary.main : 'action.hover',
                  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  '&:hover': { 
                    bgcolor: isActive ? theme.palette.primary.dark : 'action.selected' 
                  }
                }}
              >
                {station.name}
              </ButtonBase>
            );
          })}
        </Box>
      </Box>
    </Fade>
  );
};

export default SourcePicker;