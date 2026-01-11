import React, { useState } from 'react';
import { 
  Box, Typography, Button, IconButton, List, ListItem, ListItemText, 
  ListItemIcon, ListItemSecondaryAction, Divider, TextField, Switch, 
  FormControlLabel, FormGroup, Fade 
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

// Icons for the Picker
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';

import { useSettings } from '../../../context/SettingsContext';

const ICONS = [
  { id: 'Home', icon: <HomeRoundedIcon /> },
  { id: 'Work', icon: <WorkRoundedIcon /> },
  { id: 'Calendar', icon: <CalendarMonthRoundedIcon /> },
  { id: 'School', icon: <SchoolRoundedIcon /> },
  { id: 'Star', icon: <StarRoundedIcon /> },
  { id: 'Person', icon: <PersonRoundedIcon /> },
  { id: 'Game', icon: <SportsEsportsRoundedIcon /> },
  { id: 'General', icon: <WidgetsRoundedIcon /> },
];

const PageSettings = () => {
  const { pages, addPage, updatePage, deletePage, activePageId, setActivePageId } = useSettings();
  
  // Local state to track which page we are currently editing
  // null = Showing the list of pages
  // 'id' = Showing the editor for that page
  const [editingId, setEditingId] = useState(null);

  // --- ACTIONS ---
  const handleAdd = () => {
    addPage('New Page', 'General');
    // Note: addPage in context switches activePageId. 
    // We don't automatically open edit mode here to keep flow stable,
    // or we could find the new ID and setEditingId(newId).
  };

  const handleDelete = (id) => {
    if (pages.length <= 1) return;
    deletePage(id);
    if (editingId === id) setEditingId(null);
  };

  // --- SUB-COMPONENT: PAGE EDITOR ---
  const PageEditor = ({ pageId }) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return null;

    const handleUpdate = (field, value) => {
      updatePage(pageId, { [field]: value });
    };

    const toggleWidget = (key) => {
      updatePage(pageId, {
        widgets: { ...page.widgets, [key]: !page.widgets[key] }
      });
    };

    return (
      <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton onClick={() => setEditingId(null)} size="small" sx={{ bgcolor: 'action.hover' }}>
            <ArrowBackRoundedIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={700}>
            Editing "{page.name}"
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Identity */}
          <Box>
            <TextField 
              label="Page Name" 
              value={page.name} 
              onChange={(e) => handleUpdate('name', e.target.value)}
              size="small" fullWidth sx={{ mb: 2 }}
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

          {/* Widgets */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>Visible Widgets</Typography>
            <FormGroup>
              {['clock', 'weather', 'news', 'calendar', 'notes'].map(widget => (
                <FormControlLabel 
                  key={widget}
                  control={
                    <Switch 
                      size="small"
                      checked={page.widgets[widget]} 
                      onChange={() => toggleWidget(widget)} 
                    />
                  } 
                  label={widget.charAt(0).toUpperCase() + widget.slice(1)} 
                />
              ))}
            </FormGroup>
          </Box>

          <Divider />

          {/* Danger Zone */}
          <Button 
            color="error" 
            variant="outlined" 
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={() => handleDelete(page.id)}
            disabled={pages.length <= 1}
            fullWidth
          >
            Delete Page
          </Button>
        </Box>
      </Box>
    );
  };

  // --- RENDER ---
  
  // MODE 1: EDITOR
  if (editingId) {
    return <PageEditor pageId={editingId} />;
  }

  // MODE 2: LIST
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" color="primary" fontWeight={700}>My Pages</Typography>
        <Button 
          size="small" 
          startIcon={<AddCircleOutlineRoundedIcon />} 
          onClick={handleAdd}
          sx={{ textTransform: 'none' }}
        >
          Add Page
        </Button>
      </Box>

      <List dense disablePadding sx={{ bgcolor: 'action.hover', borderRadius: 3, overflow: 'hidden' }}>
        {pages.map((page, index) => {
          const Icon = ICONS.find(i => i.id === page.icon)?.icon || <WidgetsRoundedIcon />;
          const isActive = page.id === activePageId;

          return (
            <React.Fragment key={page.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? 'primary.main' : 'text.secondary' }}>
                  {Icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Box component="span" sx={{ fontWeight: isActive ? 700 : 400 }}>
                      {page.name} {isActive && <Typography component="span" variant="caption" color="primary">(Active)</Typography>}
                    </Box>
                  } 
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" size="small" onClick={() => setEditingId(page.id)}>
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default PageSettings;