import React from 'react';
import { Box, InputBase, IconButton, useTheme, Tooltip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ViewColumnRoundedIcon from '@mui/icons-material/ViewColumnRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';

const TableBlock = ({ block, updateBlock }) => {
  const theme = useTheme();
  
  // Default to 2 columns if not defined
  const colCount = block.colCount || 2;

  const updateCell = (rowId, colKey, value) => {
    const newRows = block.rows.map(r => r.id === rowId ? { ...r, [colKey]: value } : r);
    updateBlock(block.id, { rows: newRows });
  };

  const addRow = () => {
    // Initialize new row with empty strings for current columns
    const newRow = { id: Date.now() };
    for (let i = 1; i <= colCount; i++) {
      newRow[`c${i}`] = '';
    }
    updateBlock(block.id, { rows: [...block.rows, newRow] });
  };

  const addColumn = () => {
    if (colCount < 4) {
      updateBlock(block.id, { colCount: colCount + 1 });
    }
  };

  const removeColumn = () => {
    if (colCount > 1) {
      updateBlock(block.id, { colCount: colCount - 1 });
    }
  };

  return (
    <Box sx={{ 
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '12px',
      bgcolor: 'transparent',
      overflow: 'hidden',
      my: 2 
    }}>
      
      {/* Optional: Column Controls (Only show if we can actually modify) */}
      <Box sx={{ 
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center', 
        bgcolor: 'action.hover', borderBottom: `1px solid ${theme.palette.divider}`, px: 1 
      }}>
        {colCount > 1 && (
          <Tooltip title="Remove Column">
            <IconButton size="small" onClick={removeColumn} sx={{ opacity: 0.6 }}>
              <RemoveCircleOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Add Column (Max 4)">
          <span>
            <IconButton size="small" onClick={addColumn} disabled={colCount >= 4} sx={{ opacity: colCount >= 4 ? 0.3 : 1 }}>
              <ViewColumnRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Rows */}
      <Box sx={{ width: '100%' }}>
        {block.rows.map((row) => (
          <Box 
            key={row.id} 
            sx={{ 
              display: 'grid', 
              // CSS Grid for equal width columns
              gridTemplateColumns: `repeat(${colCount}, 1fr)`,
              borderBottom: `1px solid ${theme.palette.divider}` 
            }}
          >
            {[...Array(colCount)].map((_, i) => {
              const colIndex = i + 1;
              const colKey = `c${colIndex}`;
              return (
                <InputBase 
                  key={colKey}
                  value={row[colKey] || ''} 
                  onChange={(e) => updateCell(row.id, colKey, e.target.value)}
                  placeholder="..."
                  sx={{ 
                    width: '100%',
                    p: 1.5, 
                    // Add border to right unless it's the last column
                    borderRight: colIndex < colCount ? `1px solid ${theme.palette.divider}` : 'none',
                    fontSize: '1.1rem' // Larger Font
                  }} 
                />
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Footer Add Row */}
      <IconButton 
        onClick={addRow} 
        fullWidth 
        sx={{ 
          borderRadius: 0, py: 1.5, fontSize: '0.8rem', fontWeight: 700, 
          letterSpacing: '1px', textTransform: 'uppercase', color: 'text.secondary',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        <AddRoundedIcon sx={{ fontSize: 18, mr: 1 }} /> Add Row
      </IconButton>
    </Box>
  );
};

export default TableBlock;