import React from 'react';
import { 
  Box, Typography, TextField, IconButton, CircularProgress, 
  List, ListItem, ListItemText, Button 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchOverlay = ({ 
  mode, 
  searchTerm, 
  onSearchTermChange, 
  onSearch, 
  isSearching, 
  results, 
  onSelect, 
  onCancel 
}) => {
  if (!mode) return null;

  return (
    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Searching for {mode === 'weather' ? 'Weather Location' : 'World Clock City'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField 
          fullWidth size="small" placeholder="Enter city name..." 
          value={searchTerm} onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          autoFocus
        />
        <IconButton onClick={onSearch} disabled={isSearching}><SearchIcon /></IconButton>
      </Box>
      
      {isSearching && <CircularProgress size={20} sx={{ mt: 2 }} />}
      
      <List dense sx={{ maxHeight: 200, overflow: 'auto', mt: 1 }}>
        {results.map((loc) => (
          <ListItem button key={loc.id} onClick={() => onSelect(loc)}>
            <ListItemText primary={loc.name} secondary={`${loc.country} (${loc.timezone})`} />
          </ListItem>
        ))}
      </List>
      
      <Button size="small" onClick={onCancel} sx={{ mt: 1 }}>Cancel</Button>
    </Box>
  );
};

export default SearchOverlay;