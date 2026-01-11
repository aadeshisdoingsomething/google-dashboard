import React, { useState } from 'react';
import { 
  Box, Typography, Button, IconButton, Divider, TextField, Switch, 
  FormControlLabel, FormGroup, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, Paper 
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

// Icons
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
  const { pages, addPage, updatePage, deletePage, activePageId } = useSettings();
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // Safety state

  const handleAdd = () => {
    addPage('New Page', 'General');
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deletePage(deleteConfirmId);
      if (editingId === deleteConfirmId) setEditingId(null);
      setDeleteConfirmId(null);
    }
  };

  const PageEditor = ({ pageId }) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return null;

    const handleUpdate = (field, value) => updatePage(pageId, { [field]: value });
    const toggleWidget = (key) => updatePage(pageId, { widgets: { ...page.widgets, [key]: !page.widgets[key] } });

    return (
      <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton onClick={() => setEditingId(null)} size="small" sx={{ bgcolor: 'action.hover' }}>
            <ArrowBackRoundedIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={700}>Editing "{page.name}"</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <TextField label="Page Name" value={page.name} onChange={(e) => handleUpdate('name', e.target.value)} size="small" fullWidth sx={{ mb: 2 }} />
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
                <FormControlLabel key={widget} control={<Switch size="small" checked={page.widgets[widget]} onChange={() => toggleWidget(widget)} />} label={widget.charAt(0).toUpperCase() + widget.slice(1)} />
              ))}
            </FormGroup>
          </Box>
          <Divider />
          <Button color="error" variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => setDeleteConfirmId(page.id)} disabled={pages.length <= 1} fullWidth>
            Delete Page
          </Button>
        </Box>
      </Box>
    );
  };

  if (editingId) return (
    <>
      <PageEditor pageId={editingId} />
      {/* Shared Delete Dialog */}
      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Delete Page?</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete this page? This cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disableElevation>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="primary" fontWeight={700}>My Pages</Typography>
        <Button size="small" startIcon={<AddCircleOutlineRoundedIcon />} onClick={handleAdd} sx={{ textTransform: 'none' }}>Add Page</Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {pages.map((page) => {
          const Icon = ICONS.find(i => i.id === page.icon)?.icon || <WidgetsRoundedIcon />;
          const isActive = page.id === activePageId;

          return (
            <Paper 
              key={page.id}
              elevation={0}
              onClick={() => setEditingId(page.id)}
              sx={{
                p: 2, display: 'flex', alignItems: 'center', gap: 2,
                borderRadius: 3, border: `1px solid ${isActive ? 'transparent' : 'rgba(128,128,128,0.2)'}`,
                bgcolor: isActive ? 'primary.main' : 'background.paper',
                color: isActive ? 'primary.contrastText' : 'text.primary',
                cursor: 'pointer', transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 1 }
              }}
            >
              {React.cloneElement(Icon, { color: 'inherit' })}
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700}>{page.name}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {isActive ? 'Active Page' : 'Tap to edit'}
                </Typography>
              </Box>
              <EditRoundedIcon fontSize="small" sx={{ opacity: 0.7 }} />
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default PageSettings;