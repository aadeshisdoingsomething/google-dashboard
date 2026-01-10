import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

const NewsLogo = ({ onRefresh }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ 
        width: 42, height: 42, 
        bgcolor: '#D9352C', color: 'white',
        borderRadius: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: '0.8rem', letterSpacing: '-0.5px',
        boxShadow: '0 2px 8px rgba(217, 53, 44, 0.3)',
        flexShrink: 0
      }}>
        NPR
      </Box>
      <Tooltip title="Refresh Feed">
          <IconButton 
              size="small" 
              onClick={onRefresh}
              sx={{ width: 20, height: 20, opacity: 0.5, '&:hover': { opacity: 1 } }}
          >
              <RefreshRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
      </Tooltip>
    </Box>
  );
};

export default NewsLogo;