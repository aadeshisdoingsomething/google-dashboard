import React from 'react';
import { Box, InputBase, IconButton, useTheme } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const TableBlock = ({ block, updateBlock }) => {
  const theme = useTheme();

  const updateCell = (rowId, col, value) => {
    const newRows = block.rows.map(r => r.id === rowId ? { ...r, [col]: value } : r);
    updateBlock(block.id, { rows: newRows });
  };

  const addRow = () => {
    updateBlock(block.id, { rows: [...block.rows, { id: Date.now(), c1: '', c2: '' }] });
  };

  return (
    <Box sx={{ 
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '12px',
      bgcolor: 'transparent',
      overflow: 'hidden',
      my: 2 
    }}>
      {/* Rows */}
      <Box sx={{ width: '100%' }}>
        {block.rows.map((row) => (
          <Box key={row.id} sx={{ display: 'flex', borderBottom: `1px solid ${theme.palette.divider}` }}>
            <InputBase 
              value={row.c1} 
              onChange={(e) => updateCell(row.id, 'c1', e.target.value)}
              placeholder="..."
              sx={{ flex: 1, p: 1.5, borderRight: `1px solid ${theme.palette.divider}`, fontSize: '0.95rem' }} 
            />
            <InputBase 
              value={row.c2} 
              onChange={(e) => updateCell(row.id, 'c2', e.target.value)}
              placeholder="..."
              sx={{ flex: 1, p: 1.5, fontSize: '0.95rem' }} 
            />
          </Box>
        ))}
      </Box>
      {/* Footer Add Row */}
      <IconButton 
        onClick={addRow} 
        fullWidth 
        sx={{ 
          borderRadius: 0, py: 1, fontSize: '0.75rem', fontWeight: 700, 
          letterSpacing: '1px', textTransform: 'uppercase', color: 'text.secondary',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        <AddRoundedIcon sx={{ fontSize: 16, mr: 1 }} /> Add Row
      </IconButton>
    </Box>
  );
};

export default TableBlock;