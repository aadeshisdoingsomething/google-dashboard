import React from 'react';
import { 
  Box, Typography, Button, IconButton, Divider, TextField, Switch, 
  FormControlLabel, FormGroup 
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import { useSettings } from '../../../context/SettingsContext';
import { ICONS, WIDGET_DEFAULTS } from './layoutDefaults';

const PageEditor = ({ pageId, onBack, onDeleteRequest }) => {
  const { pages, updatePage } = useSettings();
  const page = pages.find(p => p.id === pageId);

  // Safety check if page was just deleted
  if (!page) return null;

  const handleUpdate = (field, value) => updatePage(pageId, { [field]: value });

  // SMART TOGGLE: Injects default size only if the widget is missing from layout
  const toggleWidget = (widgetKey) => {
    const isTurningOn = !page.widgets[widgetKey];
    
    // 1. Update status
    const newWidgets = { ...page.widgets, [widgetKey]: isTurningOn };
    
    // 2. Update layouts (inject size if missing)
    let newLayouts = { ...(page.layouts || { lg: [], md: [], sm: [] }) };

    if (isTurningOn) {
      ['lg', 'md', 'sm'].forEach((bp) => {
        const currentList = newLayouts[bp] || [];
        const exists = currentList.find(item => item.i === widgetKey);
        
        if (!exists) {
          // Inject default defaults so it's not 1x1
          const defaults = WIDGET_DEFAULTS[widgetKey] || { w: 4, h: 4 };
          newLayouts = {
            ...newLayouts,
            [bp]: [
              ...currentList,
              { i: widgetKey, x: 0, y: Infinity, ...defaults }
            ]
          };
        }
      });
    }

    // 3. Save
    updatePage(pageId, { widgets: newWidgets, layouts: newLayouts });
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={onBack} size="small" sx={{ bgcolor: 'action.hover' }}>
          <ArrowBackRoundedIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={700}>Editing "{page.name}"</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <TextField 
            label="Page Name" 
            value={page.name} 
            onChange={(e) => handleUpdate('name', e.target.value)} 
            size="small" 
            fullWidth 
            sx={{ mb: 2 }} 
          />
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Icon</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {ICONS.map((item) => (
              <IconButton
                key={item.id}
                onClick={() => handleUpdate('icon', item.id)}
                sx={{
                  bgcolor: page.icon === item.id ? 'primary.main' : 'action.hover',
                  color: page.icon === item.id ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': { bgcolor: page.icon === item.id ? 'primary.dark' : 'action.selected' }
                }}
              >
                {item.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant="subtitle2" gutterBottom>Visible Widgets</Typography>
          <FormGroup>
            {['clock', 'weather', 'news', 'calendar', 'notes'].map(widget => (
              <FormControlLabel 
                key={widget} 
                control={
                  <Switch 
                    size="small" 
                    checked={!!page.widgets[widget]} 
                    onChange={() => toggleWidget(widget)} 
                  />
                } 
                label={widget.charAt(0).toUpperCase() + widget.slice(1)} 
              />
            ))}
          </FormGroup>
        </Box>
        <Divider />
        <Button 
          color="error" 
          variant="outlined" 
          startIcon={<DeleteOutlineRoundedIcon />} 
          onClick={() => onDeleteRequest(page.id)} 
          disabled={pages.length <= 1} 
          fullWidth
        >
          Delete Page
        </Button>
      </Box>
    </Box>
  );
};

export default PageEditor;